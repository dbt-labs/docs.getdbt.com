select
    id as payment_id,
    orderid as order_id,
    paymentmethod as payment_method,
    status,

    -- amount is stored in cents, convert it to dollars
    {{ cents_to_dollars('amount', 4) }} as amount,
    created as created_at

from {{ source('stripe','payment') }}