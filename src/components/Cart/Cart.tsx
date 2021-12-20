import React, { useEffect, useState } from "react";
import "./Cart.scss";
import * as productInventory from "../../apis/product-inventory.json";
import {
	setCartItemQuantity,
	removeCartItem,
} from "../../redux/slices/cartSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { Modal } from "react-bootstrap";

interface Product {
	id: number;
	name: string;
	description: string;
	price: string;
	imageUrl: string;
	quantity: number;
}

interface ProductQuantity {
	id: number;
	quantity: number;
}

interface CartProps {
	show: boolean;
	onHide: (showCart: boolean) => void;
}

const Cart: React.FC<CartProps> = ({ show, onHide }) => {
	const cartItems = useAppSelector((state) => state.cart.value);
	const productInventoryList: any = (productInventory as any).default;
	const [totalPrice, setTotalPrice] = useState<number>(0);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const calculateTotalPrice = () => {
			let calculatedPrice = 0;
			cartItems.forEach((cartItem: Product) => {
				calculatedPrice += cartItem.quantity * +cartItem.price;
			});
			setTotalPrice(calculatedPrice);
		};

		let isMounted = true;
		if (isMounted) {
			calculateTotalPrice();
			return () => {
				isMounted = false;
			};
		}
	}, [cartItems]);

	const incrementItemQuantity = (product: Product) => {
		if (!isProductOutOfStock(product)) {
			const cartItem = { ...product };
			cartItem.quantity = cartItem.quantity + 1;
			dispatch(setCartItemQuantity(cartItem));
		}
	};

	const decrementItemQuantity = (product: Product) => {
		if (product.quantity === 1) {
			removeCart(product);
		} else {
			const cartItem = { ...product };
			cartItem.quantity = cartItem.quantity - 1;
			dispatch(setCartItemQuantity(cartItem));
		}
	};

	const isProductOutOfStock = (product: Product) => {
		let isOutOfStock = false;
		productInventoryList.forEach((InventoryItem: ProductQuantity) => {
			if (InventoryItem.id === product.id) {
				if (product.quantity + 1 > InventoryItem.quantity) isOutOfStock = true;
			}
		});
		return isOutOfStock;
	};

	const removeCart = (product: Product) => {
		dispatch(removeCartItem(product)).then(({ payload }) => {
			if (payload.length === 0) onHide(false);
		});
	};

	return (
		<Modal
			show={show}
			onHide={() => onHide(false)}
			size="xl"
			aria-labelledby="contained-modal-title-vcenter"
			dialogClassName="modal-custom"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<h3 className="Heading">Shopping Cart</h3>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{cartItems &&
					cartItems.map((cartItem: Product, index: number) => {
						return (
							<div className="Cart-Items" key={index}>
								<div className="image-box">
									<img
										src={cartItem.imageUrl}
										style={{ height: "120px" }}
										alt="Product"
									/>
								</div>
								<div className="about">
									<h1 className="title">{cartItem.name}</h1>
									<h3 className="subtitle">{cartItem.description}</h3>
								</div>
								<div className="counter">
									<div
										className="btn"
										onClick={() => incrementItemQuantity(cartItem)}
									>
										+
									</div>
									<div className="count">{cartItem.quantity}</div>
									<div
										className="btn"
										onClick={() => decrementItemQuantity(cartItem)}
									>
										-
									</div>
								</div>
								<div className="prices">
									<div className="amount">
										INR {cartItem.quantity * +cartItem.price}
									</div>
									{/* <div className="save">
											<u>Save for later</u>
										</div> */}
									<div className="remove" onClick={() => removeCart(cartItem)}>
										<u>Remove</u>
									</div>
								</div>
							</div>
						);
					})}
				<hr />
				<div className="checkout">
					<div className="total">
						<div>
							<div className="Subtotal">Sub-Total</div>
							<div className="items">{cartItems.length} items</div>
						</div>
						<div className="total-amount">INR {totalPrice}</div>
					</div>
					<button className="button">Checkout</button>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default Cart;
