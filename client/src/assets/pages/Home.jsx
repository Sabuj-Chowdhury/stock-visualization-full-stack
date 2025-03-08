import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("/stock_market_data.json")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => console.error("Error fetching JSON:", error));
  }, []);

  console.log(data);

  return (
    <div>
      <p className="text-xl text-pink-500">Hello</p>
    </div>
  );
};

export default Home;
