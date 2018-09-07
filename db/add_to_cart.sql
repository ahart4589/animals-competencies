INSERT INTO cart(product_id, quantity)
VALUES ($2, $1);

SELECT * FROM cart
JOIN products on cart.product_id = products.id
ORDER BY product_id;