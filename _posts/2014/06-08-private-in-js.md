title: JavaScript에서 private 필드
date: 2014-06-08
tags: javascript

---
JavaScript를 주로 사용하게 되면서 JavaScript에 대한 부정적인 생각이 줄어들었지만, 여전히 마음에 들지 않는 부분이 있다. 그 중 하나가 `private` 필드를 만들기가 애매하다는 점이다.
<!--more-->

```
function User() {
  this.passwordHash = ...;
  ...
}
```

이렇게 하면 `passwordHash`을 객체 밖에서 마음대로 참조하고 덮어쓸 수 있다. 이렇게 하는 것은 왠지 불안하다.

```
function User() {
  var passwordHash;
  ...
}
```

이렇게 하면 `passwordHash`을 `User` 객체 밖에서 볼 수 없게 된다. 문제는 `User` 객체의 메서드에서도 볼 수 없다는 점이다. 메서드는 보통 `prototype`에 만들어주는 것이 좋다. 객체 인스턴스마다 중복된 함수 객체를 별도로 생성하지 않게 하기 때문이다.

```
User.prototype.setPasswordHash(passwd) {
  // 여기서 passwordHash을 참조하려면???
}
```

클로저를 이용하면 `private` 필드를 만드는 것이 가능하긴 하다. 다만 그렇게 하려면 메서드를 생성자 안으로 넣어야 한다.

```
function User() {
  var passwordHash;
  ...
  this.setPasswordHash = function (passwd) {
    // 여기서는 passwordHash을 참조할 수 있다.
    passwordHash = hash(passwd);
  }
}
```

이렇게 하면 두 가지 마음에 안 드는 점이 생긴다. 첫째는 함수 `setPasswordHash`의 인스턴스가 `User` 인스턴스마다 생긴다는 점이다. 만약 `User`가 매우 빈번하게 생성되며 많은 인스턴스를 유지해야 하는 경우라면 성능에 불리해진다. 불필요하게 메모리를 많이 소비할뿐 아니라 `User` 인스턴스를 생성할 때마다 함수 객체도 다시 생성해야 하기 때문에 속도에서도 손해를 볼 것이다. 둘째는 약간 미학적인 측면인데, 생성자 코드와 메서드 정의가 섞여버려 보기가 안 좋아진다는 점이다.

필드를 읽기전용 속성으로 만드는 방법도 있긴 하다.

```
function User() {
  var passwordHash;
  ...
  Object.defineProperty(this, 'passwordHash', {
    get: function () { return passwordHash; }
  });
}
```

이렇게 하면 `prototype`에 정의한 메서드에서도 `passwordHash`을 참조할 수 있다. 그러나 `property`를 넣으면 객체 생성 속도가 10배 이상 느려진다. 또한 필드를 완전히 밖으로 노출하지 않고 싶을 때는 이 방법도 사용할 수 없다.

아직 어떻게 하는 것이 최선인지 잘 모르겠다. 지금까지는 다음과 같이 타협하고 있다.

* 보통 객체 인스턴스를 많이 만들지 않는 것이 확실한 경우에는 그냥 클로저를 사용하고 메서드를 생성자 안에 넣는 방법을 사용한다.
* 필드를 읽기전용으로 만들면 밖으로 노출해도 상관 없는 경우에는 `property`를 사용한다.
* 이도 저도 안 될때는 그냥 공개 필드로 선언한다. 프로그램 내부에서만 사용하는 객체라면 이렇게 해도 내가 주의해 사용하면 되므로 그럭저럭 견딜만하다.
