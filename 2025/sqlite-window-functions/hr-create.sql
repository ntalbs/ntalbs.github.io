CREATE TABLE regions (
      region_id      NUMBER primary key
    , region_name    VARCHAR2(25)
);

CREATE TABLE countries (
      country_id      CHAR(2) primary key
    , country_name    VARCHAR2(60)
    , region_id       NUMBER
);

CREATE TABLE locations (
      location_id    NUMBER(4)
    , street_address VARCHAR2(40)
    , postal_code    VARCHAR2(12)
    , city       VARCHAR2(30)
    , state_province VARCHAR2(25)
    , country_id     CHAR(2)
);

CREATE TABLE departments (
      department_id    NUMBER(4)
    , department_name  VARCHAR2(30)
    , manager_id       NUMBER(6)
    , location_id      NUMBER(4)
);

CREATE TABLE jobs (
      job_id         VARCHAR2(10)
    , job_title      VARCHAR2(35)
    , min_salary     NUMBER(6)
    , max_salary     NUMBER(6)
);

CREATE TABLE employees (
      employee_id    NUMBER(6)
    , first_name     VARCHAR2(20)
    , last_name      VARCHAR2(25)
    , email          VARCHAR2(25)
    , phone_number   VARCHAR2(20)
    , hire_date      DATE
    , job_id         VARCHAR2(10)
    , salary         NUMBER(8,2)
    , commission_pct NUMBER(2,2)
    , manager_id     NUMBER(6)
    , department_id  NUMBER(4)
);

CREATE TABLE job_history (
      employee_id   NUMBER(6)
    , start_date    DATE
    , end_date      DATE
    , job_id        VARCHAR2(10)
    , department_id NUMBER(4)
);

CREATE VIEW emp_details_view
  (employee_id,
   job_id,
   manager_id,
   department_id,
   location_id,
   country_id,
   first_name,
   last_name,
   salary,
   commission_pct,
   department_name,
   job_title,
   city,
   state_province,
   country_name,
   region_name)
AS SELECT
  e.employee_id,
  e.job_id,
  e.manager_id,
  e.department_id,
  d.location_id,
  l.country_id,
  e.first_name,
  e.last_name,
  e.salary,
  e.commission_pct,
  d.department_name,
  j.job_title,
  l.city,
  l.state_province,
  c.country_name,
  r.region_name
FROM
  employees e,
  departments d,
  jobs j,
  locations l,
  countries c,
  regions r
WHERE e.department_id = d.department_id
  AND d.location_id = l.location_id
  AND l.country_id = c.country_id
  AND c.region_id = r.region_id
  AND j.job_id = e.job_id
;

CREATE INDEX emp_department_ix ON employees (department_id);
CREATE INDEX emp_job_ix ON employees (job_id);
CREATE INDEX emp_manager_ix ON employees (manager_id);
CREATE INDEX emp_name_ix ON employees (last_name, first_name);
CREATE INDEX dept_location_ix ON departments (location_id);
CREATE INDEX jhist_job_ix ON job_history (job_id);
CREATE INDEX jhist_employee_ix ON job_history (employee_id);
CREATE INDEX jhist_department_ix ON job_history (department_id);
CREATE INDEX loc_city_ix ON locations (city);
CREATE INDEX loc_state_province_ix ON locations (state_province);
CREATE INDEX loc_country_ix ON locations (country_id);
