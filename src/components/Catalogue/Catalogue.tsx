import React, { useState } from "react";
import "./Catalogue.scss";
import * as products from "../../apis/products.json";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import Cart from "../Cart/Cart";
import { setCartItem } from "../../redux/slices/cartSlice";
import { useAppDispatch } from "../../redux/hooks";

interface Product {
	id: number;
	name: string;
	description: string;
	price: string;
	imageUrl: string;
	quantity: number;
}

const Catalogue: React.FC = (props: any) => {
	const productList: any = (products as any).default;
	const [showCart, setShowCart] = useState<boolean>(false);
	const dispatch = useAppDispatch();

	const openCart = (product: Product) => {
		const cartItem = { ...product };
		cartItem.quantity = 1;
		dispatch(setCartItem(cartItem)).then(() => setShowCart(true));
	};

	const onHide = (value: boolean) => {
		setShowCart(value);
	};

	return (
		<>
			{productList &&
				productList.map((product: Product, index: number) => {
					return (
						<div className="product-card" key={index}>
							<div className="badge">Hot</div>
							<div className="product-tumb">
								<img src={product.imageUrl} alt="" />
							</div>
							<div className="product-details">
								<span className="product-catagory">{product.name}</span>
								{/* <h4>
										<a href="">Women leather bag</a>
									</h4> */}
								<p>{product.description}</p>
								<div className="product-bottom-details">
									<div className="product-price">
										{/* <small>$96.00</small> */}
										INR {product.price}
									</div>
									<div className="product-links">
										{/* <> */}
										<ShoppingBasketIcon onClick={() => openCart(product)} />
										{/* </a> */}
									</div>
								</div>
							</div>
						</div>
					);
				})}
			{showCart && <Cart show={showCart} onHide={(value) => onHide(value)} />}
		</>
	);
};

export default Catalogue;
