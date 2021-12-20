import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Product {
	id: number;
	name: string;
	description: string;
	price: string;
	imageUrl: string;
	quantity: number;
}

interface CartState {
	value: Array<Product>;
}

const initialState: CartState = {
	value: [],
};

export const setCartItem = createAsyncThunk(
	"cart/setCartItem",
	async (payload: Product, { getState }) => {
		const { cart } = getState() as { cart: CartState };
		const itemExist = cart.value.filter((cartItem: any) => {
			return cartItem.id === payload.id;
		});
		if (itemExist.length === 0) return [...cart.value, ...[payload]];
		return cart.value;
	}
);

export const setCartItemQuantity = createAsyncThunk(
	"cart/setCartItemQuantity",
	async (payload: Product, { getState }) => {
		const { cart } = getState() as { cart: CartState };
		const index = cart.value.findIndex((cart: any) => cart.id === payload.id);
		let newArray = JSON.parse(JSON.stringify(cart.value));
		newArray.defaultForm = true;
		newArray[index].quantity = payload.quantity;
		return newArray;
	}
);

export const removeCartItem = createAsyncThunk(
	"cart/removeCartItem",
	async (payload: Product, { getState }) => {
		const { cart } = getState() as { cart: CartState };
		const index = cart.value.findIndex((cart: any) => cart.id === payload.id);
		let newArray = JSON.parse(JSON.stringify(cart.value));
		newArray.defaultForm = true;
		newArray.splice(index, 1);
		return newArray;
	}
);

export const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		//set state
	},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(setCartItem.fulfilled, (state, { payload }) => {
			state.value = payload;
		});
		builder.addCase(setCartItemQuantity.fulfilled, (state, { payload }) => {
			state.value = payload;
		});
		builder.addCase(removeCartItem.fulfilled, (state, { payload }) => {
			state.value = payload;
		});
	},
});

export default cartSlice.reducer;
