import {
  storeToLocal,
  readFromLocal,
  deleteFromLocal,
} from "./utils/localStorage";

const dummyData = {
  id: "asdsdfdf",
  name: "Harry",
  message: "hi",
};

const Demo = () => {
  const getUser = () => {
    let data = readFromLocal("user");
    console.log(data);
  };
  return (
    <div>
      <button onClick={() => storeToLocal("user", dummyData)}>Set Item</button>
      <button onClick={getUser}>Read Item</button>
      <button onClick={() => deleteFromLocal("user")}>Delete Item</button>
    </div>
  );
};

export default Demo;
