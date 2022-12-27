import React, {useState} from 'react'
import {CheckIcon} from "./CheckIcon";
import {CrossIcon} from "./CrossIcon";
import {carMichaelNumbers} from "./SpecialNumbers";
import { useForm, SubmitHandler } from "react-hook-form";
import {BigMath} from "./BigIntUtils";


type Inputs = {
  testableNumber: bigint,
  round: number,
  carmichael: boolean
};

const App: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  let enteredNumber = 0n
  let numberRounds = 0
  let detectCarMichael = false
  const [isPrim, setIsPrim] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  const onSubmit: SubmitHandler<Inputs> = data => {
    numberRounds = data.round
    enteredNumber = BigInt(data.testableNumber)
    detectCarMichael = data.carmichael
    checkIfPrim()
  }



  const calcGCD = (a: bigint, b: bigint) => {
    a = BigMath.abs(a);
    b = BigMath.abs(b);
    if (b > a) {
      let temp = a;
      a = b;
      b = temp;
    }
    while (true) {
      if (b === 0n) return a
      a =a% b
      if (a == 0n) return b
      b =b% a;
    }
  }


  const fastModularExponentiation = (a:bigint, b:bigint, n:bigint)=> {
    a = a % n;
    let result = 1n;
    let x = a;

    while(b > 0){
      let leastSignificantBit = b % 2n;

      b = b / 2n

      if (leastSignificantBit == 1n) {
        result = result * x;
        result = result % n;
      }

      x = x * x;
      x = x % n;
    }
    return result;
  }


  const checkIfPrim = async() => {
    setProgress(0)
    // Detects the carmichael numbers, see
    if (detectCarMichael) {
      if (carMichaelNumbers.includes(enteredNumber)) {
        setIsPrim(false)
        setProgress(100)
        return
      }
    }

    //initial number
    let lastNumber = 2n

    for (let i = 0; i < numberRounds; i++) {
      //Check if gcd !==1
      while (calcGCD(lastNumber, enteredNumber) !== 1n) {
        console.log("Incrementing by 1")
        // increment if our lastnumber is not gcd(lastnumber, enteredNumber)==1
        lastNumber += BigInt(1)
        console.log("Incrementing to "+lastNumber)
      }

      // start calculation
      let currentVal = lastNumber

        // Calc a^(n-1), because currentVal is already a^1, we need to subtract 2 from num
      currentVal = fastModularExponentiation(currentVal,enteredNumber-1n, enteredNumber)

      currentVal = currentVal % enteredNumber

      // Done when !==1
      if (currentVal !== 1n) {
        setIsPrim(false)
        setProgress(100)
        console.log("Done")
        return
      }

      // Update variable to next number as our current value is 1
      lastNumber += 2n
      setProgress((i+1)/(numberRounds)*100)
    }

    // If we get here we can be sure that every round returned 1.
    setIsPrim(true)
    console.log("Done")
  }


  return <form className="flex h-screen bg-white dark:bg-slate-800" onSubmit={handleSubmit(onSubmit)}>
    <div className="m-auto p-6">
      <h1 className="text-4xl dark:text-white mb-4 text-center">Primzahl-Tester</h1>
      <div className="grid grid-cols-2 gap-4">
        <label htmlFor="test-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zu testende
          Zahl</label>
        <input {...register("testableNumber", {min: 2, required: true})}
               id="test-input"
               className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        {errors.testableNumber && <div className="col-span-2 text-red-500 text-sm text-center">Die zu testende Zahl muss mindestens 2 sein</div>}

        <label htmlFor="number-rounds" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Anzahl
          Runden</label>
        <input type="number" id="number-rounds" {...register("round", {min: 1, required:true})}
               className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        {errors.round && <div className="col-span-2 text-red-500 text-sm text-center">Die zu testende Zahl muss mindestens 1 sein</div>}
      </div>

      <div className="flex gap-4 dark:text-white">
        <label htmlFor="carmichael">Carmichael-Zahlen entdecken?</label>
        <input id="carmichael" type="checkbox" {...register("carmichael")}/>
      </div>
      <div className="flex justify-center mt-4">
        <input className="text-white bg-blue-800 p-2 rounded w-3/4" type="submit" value="Vermuten"/>
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
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{width:progress+'%'}}></div>
      </div>
    </div>
  </form>
}


export default App
