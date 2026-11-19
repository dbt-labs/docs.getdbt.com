/**
 * Lineage data for the quickstarts. Generated from the manifest of
 * dbt-labs/jaffle_shop_duckdb (branch duckdb) after adding the daily_revenue
 * model the quickstart builds. Node ids are dbt resource names.
 */
export const GRAPHS = {
  "jaffleShop": {
    "nodes": [
      {
        "id": "customers",
        "label": "customers",
        "type": "model"
      },
      {
        "id": "orders",
        "label": "orders",
        "type": "model"
      },
      {
        "id": "stg_customers",
        "label": "stg_customers",
        "type": "model"
      },
      {
        "id": "stg_orders",
        "label": "stg_orders",
        "type": "model"
      },
      {
        "id": "stg_payments",
        "label": "stg_payments",
        "type": "model"
      },
      {
        "id": "raw_customers",
        "label": "raw_customers",
        "type": "seed"
      },
      {
        "id": "raw_orders",
        "label": "raw_orders",
        "type": "seed"
      },
      {
        "id": "raw_payments",
        "label": "raw_payments",
        "type": "seed"
      },
      {
        "id": "accepted_values_orders_status__placed__shipped__completed__return_pending__returned",
        "label": "accepted_values_orders_…",
        "type": "test"
      },
      {
        "id": "accepted_values_stg_orders_status__placed__shipped__completed__return_pending__returned",
        "label": "accepted_values_stg_ord…",
        "type": "test"
      },
      {
        "id": "accepted_values_stg_payments_payment_method__credit_card__coupon__bank_transfer__gift_card",
        "label": "accepted_values_stg_pay…",
        "type": "test"
      },
      {
        "id": "not_null_customers_customer_id",
        "label": "not_null_customers_cust…",
        "type": "test"
      },
      {
        "id": "not_null_orders_amount",
        "label": "not_null_orders_amount",
        "type": "test"
      },
      {
        "id": "not_null_orders_bank_transfer_amount",
        "label": "not_null_orders_bank_tr…",
        "type": "test"
      },
      {
        "id": "not_null_orders_coupon_amount",
        "label": "not_null_orders_coupon_…",
        "type": "test"
      },
      {
        "id": "not_null_orders_credit_card_amount",
        "label": "not_null_orders_credit_…",
        "type": "test"
      },
      {
        "id": "not_null_orders_customer_id",
        "label": "not_null_orders_custome…",
        "type": "test"
      },
      {
        "id": "not_null_orders_gift_card_amount",
        "label": "not_null_orders_gift_ca…",
        "type": "test"
      },
      {
        "id": "not_null_orders_order_id",
        "label": "not_null_orders_order_id",
        "type": "test"
      },
      {
        "id": "not_null_stg_customers_customer_id",
        "label": "not_null_stg_customers_…",
        "type": "test"
      },
      {
        "id": "not_null_stg_orders_order_id",
        "label": "not_null_stg_orders_ord…",
        "type": "test"
      },
      {
        "id": "not_null_stg_payments_payment_id",
        "label": "not_null_stg_payments_p…",
        "type": "test"
      },
      {
        "id": "relationships_orders_customer_id__customer_id__ref_customers_",
        "label": "relationships_orders_cu…",
        "type": "test"
      },
      {
        "id": "unique_customers_customer_id",
        "label": "unique_customers_custom…",
        "type": "test"
      },
      {
        "id": "unique_orders_order_id",
        "label": "unique_orders_order_id",
        "type": "test"
      },
      {
        "id": "unique_stg_customers_customer_id",
        "label": "unique_stg_customers_cu…",
        "type": "test"
      },
      {
        "id": "unique_stg_orders_order_id",
        "label": "unique_stg_orders_order…",
        "type": "test"
      },
      {
        "id": "unique_stg_payments_payment_id",
        "label": "unique_stg_payments_pay…",
        "type": "test"
      }
    ],
    "edges": [
      [
        "customers",
        "not_null_customers_customer_id"
      ],
      [
        "customers",
        "relationships_orders_customer_id__customer_id__ref_customers_"
      ],
      [
        "customers",
        "unique_customers_customer_id"
      ],
      [
        "orders",
        "accepted_values_orders_status__placed__shipped__completed__return_pending__returned"
      ],
      [
        "orders",
        "not_null_orders_amount"
      ],
      [
        "orders",
        "not_null_orders_bank_transfer_amount"
      ],
      [
        "orders",
        "not_null_orders_coupon_amount"
      ],
      [
        "orders",
        "not_null_orders_credit_card_amount"
      ],
      [
        "orders",
        "not_null_orders_customer_id"
      ],
      [
        "orders",
        "not_null_orders_gift_card_amount"
      ],
      [
        "orders",
        "not_null_orders_order_id"
      ],
      [
        "orders",
        "relationships_orders_customer_id__customer_id__ref_customers_"
      ],
      [
        "orders",
        "unique_orders_order_id"
      ],
      [
        "stg_customers",
        "customers"
      ],
      [
        "stg_customers",
        "not_null_stg_customers_customer_id"
      ],
      [
        "stg_customers",
        "unique_stg_customers_customer_id"
      ],
      [
        "stg_orders",
        "customers"
      ],
      [
        "stg_orders",
        "orders"
      ],
      [
        "stg_orders",
        "accepted_values_stg_orders_status__placed__shipped__completed__return_pending__returned"
      ],
      [
        "stg_orders",
        "not_null_stg_orders_order_id"
      ],
      [
        "stg_orders",
        "unique_stg_orders_order_id"
      ],
      [
        "stg_payments",
        "customers"
      ],
      [
        "stg_payments",
        "orders"
      ],
      [
        "stg_payments",
        "accepted_values_stg_payments_payment_method__credit_card__coupon__bank_transfer__gift_card"
      ],
      [
        "stg_payments",
        "not_null_stg_payments_payment_id"
      ],
      [
        "stg_payments",
        "unique_stg_payments_payment_id"
      ],
      [
        "raw_customers",
        "stg_customers"
      ],
      [
        "raw_orders",
        "stg_orders"
      ],
      [
        "raw_payments",
        "stg_payments"
      ]
    ]
  },
  "jaffleShopWithRevenue": {
    "nodes": [
      {
        "id": "customers",
        "label": "customers",
        "type": "model"
      },
      {
        "id": "daily_revenue",
        "label": "daily_revenue",
        "type": "model"
      },
      {
        "id": "orders",
        "label": "orders",
        "type": "model"
      },
      {
        "id": "stg_customers",
        "label": "stg_customers",
        "type": "model"
      },
      {
        "id": "stg_orders",
        "label": "stg_orders",
        "type": "model"
      },
      {
        "id": "stg_payments",
        "label": "stg_payments",
        "type": "model"
      },
      {
        "id": "raw_customers",
        "label": "raw_customers",
        "type": "seed"
      },
      {
        "id": "raw_orders",
        "label": "raw_orders",
        "type": "seed"
      },
      {
        "id": "raw_payments",
        "label": "raw_payments",
        "type": "seed"
      },
      {
        "id": "accepted_values_orders_status__placed__shipped__completed__return_pending__returned",
        "label": "accepted_values_orders_…",
        "type": "test"
      },
      {
        "id": "accepted_values_stg_orders_status__placed__shipped__completed__return_pending__returned",
        "label": "accepted_values_stg_ord…",
        "type": "test"
      },
      {
        "id": "accepted_values_stg_payments_payment_method__credit_card__coupon__bank_transfer__gift_card",
        "label": "accepted_values_stg_pay…",
        "type": "test"
      },
      {
        "id": "not_null_customers_customer_id",
        "label": "not_null_customers_cust…",
        "type": "test"
      },
      {
        "id": "not_null_daily_revenue_order_date",
        "label": "not_null_daily_revenue_…",
        "type": "test"
      },
      {
        "id": "not_null_orders_amount",
        "label": "not_null_orders_amount",
        "type": "test"
      },
      {
        "id": "not_null_orders_bank_transfer_amount",
        "label": "not_null_orders_bank_tr…",
        "type": "test"
      },
      {
        "id": "not_null_orders_coupon_amount",
        "label": "not_null_orders_coupon_…",
        "type": "test"
      },
      {
        "id": "not_null_orders_credit_card_amount",
        "label": "not_null_orders_credit_…",
        "type": "test"
      },
      {
        "id": "not_null_orders_customer_id",
        "label": "not_null_orders_custome…",
        "type": "test"
      },
      {
        "id": "not_null_orders_gift_card_amount",
        "label": "not_null_orders_gift_ca…",
        "type": "test"
      },
      {
        "id": "not_null_orders_order_id",
        "label": "not_null_orders_order_id",
        "type": "test"
      },
      {
        "id": "not_null_stg_customers_customer_id",
        "label": "not_null_stg_customers_…",
        "type": "test"
      },
      {
        "id": "not_null_stg_orders_order_id",
        "label": "not_null_stg_orders_ord…",
        "type": "test"
      },
      {
        "id": "not_null_stg_payments_payment_id",
        "label": "not_null_stg_payments_p…",
        "type": "test"
      },
      {
        "id": "relationships_orders_customer_id__customer_id__ref_customers_",
        "label": "relationships_orders_cu…",
        "type": "test"
      },
      {
        "id": "unique_customers_customer_id",
        "label": "unique_customers_custom…",
        "type": "test"
      },
      {
        "id": "unique_daily_revenue_order_date",
        "label": "unique_daily_revenue_or…",
        "type": "test"
      },
      {
        "id": "unique_orders_order_id",
        "label": "unique_orders_order_id",
        "type": "test"
      },
      {
        "id": "unique_stg_customers_customer_id",
        "label": "unique_stg_customers_cu…",
        "type": "test"
      },
      {
        "id": "unique_stg_orders_order_id",
        "label": "unique_stg_orders_order…",
        "type": "test"
      },
      {
        "id": "unique_stg_payments_payment_id",
        "label": "unique_stg_payments_pay…",
        "type": "test"
      }
    ],
    "edges": [
      [
        "customers",
        "not_null_customers_customer_id"
      ],
      [
        "customers",
        "relationships_orders_customer_id__customer_id__ref_customers_"
      ],
      [
        "customers",
        "unique_customers_customer_id"
      ],
      [
        "daily_revenue",
        "not_null_daily_revenue_order_date"
      ],
      [
        "daily_revenue",
        "unique_daily_revenue_order_date"
      ],
      [
        "orders",
        "daily_revenue"
      ],
      [
        "orders",
        "accepted_values_orders_status__placed__shipped__completed__return_pending__returned"
      ],
      [
        "orders",
        "not_null_orders_amount"
      ],
      [
        "orders",
        "not_null_orders_bank_transfer_amount"
      ],
      [
        "orders",
        "not_null_orders_coupon_amount"
      ],
      [
        "orders",
        "not_null_orders_credit_card_amount"
      ],
      [
        "orders",
        "not_null_orders_customer_id"
      ],
      [
        "orders",
        "not_null_orders_gift_card_amount"
      ],
      [
        "orders",
        "not_null_orders_order_id"
      ],
      [
        "orders",
        "relationships_orders_customer_id__customer_id__ref_customers_"
      ],
      [
        "orders",
        "unique_orders_order_id"
      ],
      [
        "stg_customers",
        "customers"
      ],
      [
        "stg_customers",
        "not_null_stg_customers_customer_id"
      ],
      [
        "stg_customers",
        "unique_stg_customers_customer_id"
      ],
      [
        "stg_orders",
        "customers"
      ],
      [
        "stg_orders",
        "orders"
      ],
      [
        "stg_orders",
        "accepted_values_stg_orders_status__placed__shipped__completed__return_pending__returned"
      ],
      [
        "stg_orders",
        "not_null_stg_orders_order_id"
      ],
      [
        "stg_orders",
        "unique_stg_orders_order_id"
      ],
      [
        "stg_payments",
        "customers"
      ],
      [
        "stg_payments",
        "orders"
      ],
      [
        "stg_payments",
        "accepted_values_stg_payments_payment_method__credit_card__coupon__bank_transfer__gift_card"
      ],
      [
        "stg_payments",
        "not_null_stg_payments_payment_id"
      ],
      [
        "stg_payments",
        "unique_stg_payments_payment_id"
      ],
      [
        "raw_customers",
        "stg_customers"
      ],
      [
        "raw_orders",
        "stg_orders"
      ],
      [
        "raw_payments",
        "stg_payments"
      ]
    ]
  }
};
