const ViewCart = ({ checkoutId }) => {
  const [checkout, setCheckout] = useState(null);

  useEffect(() => {
    client.checkout.fetch(checkoutId).then((checkoutData) => {
      setCheckout(checkoutData);
    });
  }, [checkoutId]);

  if (!checkout) return <div>Loading...</div>;

  return (
    <div>
      {checkout.lineItems.map((item) => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.quantity}</p>
        </div>
      ))}
      <a href={checkout.webUrl}>Proceed to Checkout</a>
    </div>
  );
};
