import {FormMain} from "./components";

function App() {
  const formDataHandler=(data)=>{
    console.log(data);
  }
  return (
    <div className="container">
      <FormMain  data={(data)=>formDataHandler(data)}/>
    </div>
  );
}

export default App;
