import Decimal from "decimal.js";
import { methodDeliveryCosts } from "../../data-list";
import assert from "assert";

interface Props {
  cart: Cart;
}

interface SubTotalByProduct extends Product {
  subTotal: string;
}

export const calculateBilling = ({ cart }: Props) => {
  const { products = [], shipment } = cart;

  const subTotalProducts = getSubTotalByProduct(products);

  const subTotal = getSubTotal(subTotalProducts);
  const shippingCost = getShippingCost(shipment);

  const totalPrice = new Decimal(subTotal).add(shippingCost).toFixed(2);

  return {
    subTotal: subTotal,
    shippingCost: shippingCost,
    totalPrice: totalPrice,
  };
};

export const getSubTotalByProduct = (
  products: Product[],
): SubTotalByProduct[] =>
  products.map((product) => ({
    ...product,
    subTotal: new Decimal(product.price).mul(product.quantity).toFixed(2),
  }));

export const getSubTotal = (subTotalProducts: SubTotalByProduct[]) =>
  subTotalProducts.reduce((acc, subTotalByProduct) => {
    if (!subTotalByProduct) return acc;

    return new Decimal(acc).add(subTotalByProduct.subTotal).toFixed(2);
  }, "0.00");

export const getShippingCost = (shipment: Shipment) => {
  if (shipment?.type === "send_to_home") {
    assert(shipment.sendToHome, "Missing shipment?.sendToHome");
    assert(
      shipment.sendToHome.methodDelivery,
      "Missing shipment?.sendToHome?.methodDelivery",
    );

    const methodDelivery = shipment?.sendToHome?.methodDelivery;

    return methodDeliveryCosts?.[methodDelivery]?.price || "0.00";
  }

  return "0.00";
};
