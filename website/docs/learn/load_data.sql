create schema raw.jaffle_shop;

create table raw.jaffle_shop.customers
(
    id integer,
    first_name varchar,
    last_name varchar
);

create table raw.jaffle_shop.orders
(
  id integer,
  user_id integer,
  order_date date,
  status varchar
);

copy into raw.jaffle_shop.customers from 's3://dbt-tutorial-test/customers.csv'
    file_format = (
        type = 'CSV'
        field_delimiter = ','
        skip_header = 1
    )
;

copy into raw.jaffle_shop.orders from 's3://dbt-tutorial-test/orders.csv'
    file_format = (
        type = 'CSV'
        field_delimiter = ','
        skip_header = 1
    )
;


create schema raw.stripe;


create or replace table raw.stripe.payment
(
  id integer,
  "orderID" integer,
  "paymentMethod" varchar,
  amount integer,
  created date
);

copy into raw.stripe.payment from 's3://dbt-tutorial-test/stripe_payments.csv'
    file_format = (
        type = 'CSV'
        field_delimiter = ','
        skip_header = 1
    )
;
