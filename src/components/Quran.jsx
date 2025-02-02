import React, { Component } from "react";
import Product from "./Product";
class ShoppingCart extends Component {
  state = {
    products: [
      { id: 1, name: "Burger", count: 2 },
      { id: 2, name: "Fried", count: 1 },
      { id: 3, name: "Cola", count: 3 },
    ],
  };
  render() {
    return (
      <React.Fragment>
        {this.state.products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </React.Fragment>
    );
  }
}

export default ShoppingCart;
