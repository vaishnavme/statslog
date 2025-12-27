import { ReactNode } from "react";

const Home = () => {
  return <div>Welcome to the Home Page</div>;
};

Home.getLayout = (page: ReactNode) => <div>{page}</div>;

export default Home;
