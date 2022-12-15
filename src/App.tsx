import {useState} from 'react'
import {CheckIcon} from "@/CheckIcon";
import {CrossIcon} from "@/CrossIcon";
import {carMichaelNumbers} from "@/SpecialNumbers";

const App: React.FC = () => {
  const [enteredNumber, setEnteredNumber] = useState(5)
  const [numberRounds, setNumberRounds] = useState(2)
  const [detectCarMichael, setDetectCarMichael] = useState<boolean>(true)
  const [isPrim, setIsPrim] = useState<boolean>(false)

  const calcGCD = (a: number, b: number) => {
    a = Math.abs(a);
    b = Math.abs(b);
    if (b > a) {
      let temp = a;
      a = b;
      b = temp;
    }
    while (true) {
      if (b == 0) return a;
      a %= b;
      if (a == 0) return b;
      b %= a;
    }
  }

  const checkIfPrim = () => {
    // Detects the carmichael numbers, see
    if (detectCarMichael) {
      if (carMichaelNumbers.includes(enteredNumber)) {
        setIsPrim(false)
        return
      }
    }

    //initial number
    let lastNumber = 2

    for (let i = 0; i < numberRounds; i++) {
      //Check if gcd !==1
      while (calcGCD(lastNumber, enteredNumber) !== 1) {
        // increment if our lastnumber is not gcd(lastnumber, enteredNumber)==1
        lastNumber += 1
      }

      // start calculation
      let currentVal = lastNumber

      // Calc a^(n-1), because currentVal is already a^1, we need to subtract 2 from num
      for (let j = 0; j < enteredNumber - 2; j++) {
        currentVal *= lastNumber
        currentVal %= enteredNumber
      }

      currentVal = currentVal % enteredNumber

      // Done when !==1
      if (currentVal !== 1) {
        setIsPrim(false)
        return
      }

      // Update variable to next number as our current value is 1
      lastNumber += 2
    }

    // If we come here we can be sure that every round returned 1.
    setIsPrim(true)
  }

  return <div className="flex h-screen bg-white dark:bg-slate-800">
    <div className="m-auto p-6">
      <h1 className="text-4xl dark:text-white mb-4 text-center">Primzahl-Tester</h1>
      <div className="grid grid-cols-2 gap-4">
        <label htmlFor="test-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zu testende
          Zahl</label>
        <input type="number" value={enteredNumber} onChange={(e) => setEnteredNumber(Number(e.target.value))}
               id="test-input"
               className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        <label htmlFor="number-rounds" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Anzahl
          Runden</label>
        <input type="number" id="number-rounds" value={numberRounds}
               onChange={(e) => {
                 const num = Number(e.target.value)
                 if(num<=0 || num>=enteredNumber){
                   return
                 }
                 setNumberRounds(Number(e.target.value))
               }}
               className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      </div>

      <div className="flex gap-4 dark:text-white">
        <label htmlFor="carmichael">Carmichael-Zahlen entdecken?</label>
        <input id="carmichael" type="checkbox" checked={detectCarMichael}
               onChange={() => setDetectCarMichael(!detectCarMichael)}/>
      </div>
      <div className="flex justify-center mt-4">
        <button className="text-white bg-blue-800 p-2 rounded w-3/4" onClick={() => {
          checkIfPrim()
        }
        }>Vermuten
        </button>
      </div>
      <div className="flex justify-center mt-2">
        <div className="">
          {isPrim ? <CheckIcon/> : <CrossIcon/>}
        </div>
        {isPrim ?
          <div className="dark:text-white">Ist wahrscheinlich eine Primzahl</div> :
          <div className="dark:text-white">Ist keine Primzahl</div>
        }
      </div>
    </div>
  </div>
}


export default App
