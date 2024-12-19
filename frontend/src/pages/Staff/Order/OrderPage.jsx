import React, { useState } from "react";
import {
  FiShoppingCart,
  FiSearch,
  FiMinus,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { IoIosCloseCircle } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import "./OrderPage.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const OrderPage = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [memberId, setMemberId] = useState("");
  const [discount, setDiscount] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const [quantities, setQuantities] = useState({});

  // thong tin sau nay se lay param hay url
  const [customerName, setCustomerName] = useState("dn quoc dat"); // Tên khách hàng
  const [branchId, setBranchId] = useState("1"); // Mã chi nhánh
  const [waiterId, setWaiterId] = useState("12"); // ID người phục vụ
  const navigate = useNavigate();

  const menuCategories = [
    {
      name: "Starters",
      items: [
        {
          id: 1,
          name: "Crispy Spring Rolls",
          description:
            "Vegetable stuffed crispy rolls served with sweet chili sauce",
          price: 8.99,
          image: "images.unsplash.com/photo-1677679619800-666cd4f41c99",
        },
        {
          id: 2,
          name: "Buffalo Wings",
          description: "Spicy chicken wings with blue cheese dip",
          price: 12.99,
          image: "images.unsplash.com/photo-1614398751058-eb2e0bf63e53",
        },
        {
          id: 3,
          name: "Buffalo Wings",
          description: "Spicy chicken wings with blue cheese dip",
          price: 12.99,
          image: "images.unsplash.com/photo-1614398751058-eb2e0bf63e53",
        },
      ],
    },
    {
      name: "Main Dishes",
      items: [
        {
          id: 3,
          name: "Grilled Salmon",
          description: "Fresh salmon with herbs and lemon butter sauce",
          price: 24.99,
          image: "images.unsplash.com/photo-1567121938596-cf8d2c8dbf17",
        },
        {
          id: 4,
          name: "Mushroom Risotto",
          description: "Creamy Italian rice with wild mushrooms and parmesan",
          price: 18.99,
          image: "images.unsplash.com/photo-1476124369491-e7addf5db371",
        },
      ],
    },
    {
      name: "Desserts",
      items: [
        {
          id: 5,
          name: "Chocolate Lava Cake",
          description: "Warm chocolate cake with molten center",
          price: 9.99,
          image: "images.unsplash.com/photo-1606313564200-e75d5e30476c",
        },
        {
          id: 6,
          name: "Tiramisu",
          description: "Classic Italian coffee-flavored dessert",
          price: 8.99,
          image: "images.unsplash.com/photo-1571877897669-02ac5eb24a0d",
        },
      ],
    },
  ];

  const updateItemQuantity = (itemId, change) => {
    setQuantities((prev) => {
      const currentQuantity = prev[itemId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const addToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
    setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    showNotification(`${item.name} added to cart`);
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: "" }), 2000);
  };

  const updateQuantity = (itemId, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  // const fakeDiscountCodes = {
  //   MEMBER123: 10, // 10% discount
  //   MEMBER456: 15, // 15% discount
  //   MEMBER789: 20, // 20% discount
  // };

  // // Function to validate and apply discount
  // const applyDiscount = () => {
  //   if (fakeDiscountCodes[memberId]) {
  //     setDiscount(fakeDiscountCodes[memberId]);
  //     showNotification(`Discount of ${fakeDiscountCodes[memberId]}% applied!`);
  //   } else {
  //     setDiscount(0);
  //     showNotification("Invalid Member ID. No discount applied.");
  //   }
  // };

  const getTotalAmount = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount; // Return as a number
  };

  const filteredMenu = menuCategories.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const handleCheckout = async () => {
    const body = {
      cus_name: customerName,
      member_card_id: memberId || null, // Member ID nếu có
      branch_id: branchId,
      waiter: waiterId,
      listDish: cart.map((item) => ({
        dish_id: item.id,
        dish_name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    console.log(body);
    try {
      const response = await fetch(
        `http://localhost:3000/api/order/submit-dine-in/1`, // /:reservation slip id
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        const result = await response.json();
        showNotification("Order submitted successfully!");
        // toast.success(`Order submitted successfully!`, {
        //   position: "top-right",
        //   autoClose: 1500,
        // });
        setCart([]); // Reset cart sau khi gửi thành công
        // navigate("/activity-history");
      } else {
        showNotification("Failed to submit the order.");
        // toast.danger(`Failed to submit the order!`, {
        //   position: "top-right",
        //   autoClose: 1500,
        // });
      }
    } catch (error) {
      showNotification("Error submitting the order.");
    }
  };

  return (
    <div className="container-order">
      <div className="content">
        {/* Header */}
        <div className="header">
          <h1 className="title">Food Menu</h1>
          <div className="header-controls">
            <div className="search-box">
              <FiSearch className="search-icon-order" />
              <input
                type="text"
                placeholder="Search menu..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="cart-button" onClick={() => setIsCartOpen(true)}>
              <FiShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="menu-grid">
          {filteredMenu.map((category) => (
            <div key={category.name} className="category">
              <h2 className="category-title">{category.name}</h2>
              <div className="items-grid">
                {category.items.map((item) => (
                  <motion.div
                    key={item.id}
                    className="menu-item"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={`https://${item.image}`}
                      alt={item.name}
                      className="item-image"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                      }}
                    />
                    <div className="item-details">
                      <div>
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-description">{item.description}</p>
                      </div>
                      <div className="item-footer">
                        <span className="item-price">${item.price}</span>
                        <div className="item-actions">
                          <div className="quantity-controls">
                            <button
                              onClick={() => updateItemQuantity(item.id, -1)}
                              className="quantity-button"
                              disabled={!quantities[item.id]}
                            >
                              <FiMinus size={16} />
                            </button>
                            <span className="quantity-display">
                              {quantities[item.id] || 0}
                            </span>
                            <button
                              onClick={() => updateItemQuantity(item.id, 1)}
                              className="quantity-button"
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => addToCart(item)}
                            className="add-to-cart-button"
                            disabled={!quantities[item.id]}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cart Sidebar */}
        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="cart-sidebar"
            >
              <div className="cart-content">
                <div className="cart-header">
                  <h2 className="cart-title">Your Cart</h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="close-cart-button"
                  >
                    <IoIosCloseCircle />
                  </button>
                </div>

                <div className="cart-items">
                  {cart.length === 0 ? (
                    <p className="empty-cart-message">Your cart is empty</p>
                  ) : (
                    <div className="cart-item-list">
                      {cart.map((item) => (
                        <div key={item.id} className="cart-item">
                          <img
                            src={`https://${item.image}`}
                            alt={item.name}
                            className="cart-item-image"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                            }}
                          />
                          <div className="cart-item-details">
                            <h3 className="cart-item-name">{item.name}</h3>
                            <p className="cart-item-price">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <div className="cart-item-actions">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="cart-quantity-button"
                              >
                                <FiMinus size={16} />
                              </button>
                              <span className="cart-quantity-display">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="cart-quantity-button"
                              >
                                <FiPlus size={16} />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="remove-item-button"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Member ID Search for Discount */}
                <div className="discount-section">
                  <label htmlFor="memberId" className="discount-label">
                    Enter Member ID for Discount:
                  </label>
                  <input
                    type="text"
                    id="memberId"
                    className="discount-input"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="Enter Member ID"
                  />
                  {/* <button
                    onClick={toast.success(`go!`, {
                      position: "top-right",
                      autoClose: 1500,
                    })}
                    className="apply-discount-button"
                  >
                    Apply
                  </button> */}
                </div>

                <div className="cart-footer">
                  {/* Tổng giá ban đầu */}
                  <div className="cart-total">
                    <span>Subtotal:</span>
                    <span>
                      $
                      {cart
                        .reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>

                  {/* Hiển thị mức giảm giá nếu có */}
                  {discount > 0 && (
                    <div className="cart-discount">
                      <span>Discount ({discount}%):</span>
                      <span>
                        -$
                        {(
                          cart.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                          ) *
                          (discount / 100)
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Tổng giá sau giảm */}
                  <div className="cart-total-final">
                    <span>Total:</span>
                    <span>
                      $
                      {(
                        cart.reduce(
                          (total, item) => total + item.price * item.quantity,
                          0
                        ) *
                        (1 - discount / 100)
                      ).toFixed(2)}
                    </span>
                  </div>

                  {/* Nút Thanh Toán */}
                  <button
                    className="checkout-button"
                    disabled={cart.length === 0}
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="notification"
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
