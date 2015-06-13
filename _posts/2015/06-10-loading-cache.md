tags: [java, 상념]
date: 2015-06-10
title: Guava Cache 제대로 사용하기
---
[Google Guava Cache](https://code.google.com/p/guava-libraries/wiki/CachesExplained)는 캐시를 쉽게 사용할 수 있도록 다양한 기능을 제공한다. 간단한 코드로 캐시 크기, 캐시 시간, 데이터 로딩 방법, 데이터 리프레시 방법 등을 제어할 수 있다. 회사에서도 성능 향상을 위해 Guava 캐시가 널리 사용되고 있는데, 최근 캐시 관련 코드를 보다가 이상한 점을 발견했다.<!--more-->

Guava 캐시는 `CacheBuilder`를 이용해 쉽게 만들 수 있다. `LoadingCache`를 사용하면 `CacheLoader`의 `load`와 `loadAll` 메서드를 오버라이드해 데이터 로딩 방법을 지정할 수 있다. 그런데 회사 코드에서 캐시를 사용하는 부분은 거의 대부분 다음과 같은 패턴으로 작성되어 있었다. 여기서는 `Product` 객체를 캐시하며, 원천 데이터는 `productService`로부터 가져온다고 가정하자.

```java
private Cache<Key, Product> productCache = CacheBuilder.newBuilder()
    .maximumSize(MAX_SIZE)
    .expireAfterWrite(DURATION, TimeUnit.MINUTES)
    .build();

...

public Product getProduct(Key key) {
  reloadIfNecessary(Lists.newArrayList(key));
  return productCache.getIfPresent(key);
}

public List<Product> getProducts(List<Key> keys) {
  reloadIfNecessary(keys);
  List<Product> products = Lists.newArrayList();
  for (Key key : keys) {
    Product p = productCache.getIfPresent(key);
    if (p != null) {
      products.add(p);
    }
  }
  return products;
}
```

`Product` 객체를 얻기 전에 항상 `reloadIfNecessary`를 호출한다. `reloadIfNecessary`는 다음과 같이 구현되어 있다.

```java
private void reloadIfNecessary(List<Key> keys) {
  try {
    List<Product> toReload = Lists.newArrayList();
    for (Key key : keys) {
      if (productCache.getIfPresent(key) == null) {
        toReload.add(key);
      }
    }
    if (CollectionUtils.isNotEmpty(toReload)) {
      List<Product> products = productService.findByIds(toReload);
      productCache.putAll(Maps.uniqueIndex(products, Product.keyFunc));
    }
  } catch (Exception e) {
    log.error("Reload product-cache exception : " + e.getMessage());
  }
}
```

`reloadIfNecessary` 메서드가 하는 일은, 요청한 키 목록에 대한 아이템이 캐시에 있는지 살펴보고 없는 키에 대해서는 다른 서비스를 통해 아이템을 구해 캐시에 채워 넣는 것이다.

왜 이렇게 했을까? 캐시에 없는 데이터를 캐시로 로드하는 기능은 `LoadingCache`에 있는 기능이다. 이미 Guava 캐시 라이브러리에 구현되어 있는 것을 쓸데없이 다시 구현했다. 이와 거의 동일한 코드가 `LoadingCache`에 이미 구현되어 있으므로 위 코드는 불필요하다. 단지 캐시를 생성할 때 `CacheLoader`를 만들어 넣어주면 된다.

```java
private LoadingCache<Key, Product> productCache = CacheBuilder.newBuilder()
    .maximumSize(MAX_SIZE)
    .expireAfterWrite(DURATION, TimeUnit.MINUTES)
    .build(new CacheLoader<Key, Product>() {
      @Override public Product load(Key key) {
        return productService.findById(key);
      }

      @Override public Map<Key, Product> loadAll(Iterable<? extends Key> keys) {
        List<Product> products = productService.findByIds(keys);
        return Maps.uniqueIndex(products, Product.keyFunc);
      }
   });
```

`LoadingCache`에서 `get` 또는 `getAll` 메서드를 통해 아이템을 얻으려 할 때 해당 아이템이 없으면 `load` 또는 `loadAll` 메서드가 호출되어 캐이에 데이터를 채울 것이다. `loadAll`은 리턴 타입이 `Map<Key, Product>`인데 `productService.findByIds`의 리턴 타입은 `List<Product>`기 때문에 변환을 위한 코드가 추가되었다. `Product.keyFunc`는 `Product`로부터 `Key`를 얻는 함수(Guava의 `Function`)다.

이제 `getProduct`와 `getProducts`도 다음과 같이 수정할 수 있다.

```java
public Product getProduct(Key key) {
  try {
    return productCache.getUnchecked(key);
  } catch (ExecuteException x) {
    return null;
  }
}

public Map<Key, Product> getProducts(Iterable<Key> keys) throws ExecuteException {
  try {
    return Map<Key, Product> m = productCache.getAll(keys);
  } catch (ExecuteException x) {
    return productCache.getAllPresent(keys);
  }
}
```

코드가 훨씬 단순해 졌다. 길이만 짧아진게 아니라 이해하기도 쉬워졌다. 수정 전의 코드는 길이도 길뿐 아니라 쓸데없는 잡음으로 이해도 어렵게 했다.

참고로, `getProducts`의 파라미터 타입을 `List<Key>`에서 `Iterable<Key>`로, 리턴 타입은 `List<Product>`에서 `Map<Key, Product>`로 바꾸었다. 파라미터 타입을 바꾼 이유는 `LoadingCache.getAll` 메서드의 파라미터 타입과 맞추기 위해서다. `getAll` 메서드가 `Iterable<Key>`을 파라미터로 받을 수 있는데 `getProducts`의 파라미터를 `List<Key>`로 제한할 필요는 없어 보인다. 물론 `getProducts`를 호출할 때 `List<Key>`를 전달하는 것은 가능하다.

또한 파라미터로 여러 개의 `Key`를 전달했는데 `Product`의 목록만 리턴하는 것 보다는 `Key`-`Product` 맵으로 리턴하는 것이 더 합당해 보인다. 상황에 따라 이렇게 마음대로 인터페이스를 바꾸는 게 불가능할 수도 있다. 인터페이스를 바꾸는 게 좋을지 유지하는게 좋을지 판단은 각자의 몫이다.

## 결론
라이브러리를 사용하기로 했다면 최소한 해당 라이브러리의 사용 방법과 API를 미리 확인해야 한다. 제대로 확인하지 않고 라이브러리에 이미 있는 기능을 다시 구현하는 것은 바보 같은 짓이다. 코드만 길어지는 게 아니라 불필요한 잡음을 추가해 코드의 가독성을 떨어뜨리고 유지보수를 어렵게 만든다.
