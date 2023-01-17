import {Habit} from "./components/Habit"
import './styles/global.css';

function App() {

  return (
    <>
      <Habit completed={2} />
      <Habit completed={3} />
      <Habit completed={1} />
    </>
  )
}

export default App
