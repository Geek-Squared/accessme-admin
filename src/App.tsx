import "./App.css";
import useFetchCurrentUser from "./hooks/useFetchCurrentUser";
// import Table from './components/table/Table'

function App() {
  const { user } = useFetchCurrentUser();

  console.log("user", user);
  return <>{/* <Table /> */}</>;
}

export default App;
