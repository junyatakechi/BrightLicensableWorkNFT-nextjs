import { decrement, increment, incrementByAmount} from "@/store/counterSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from 'react';

//
export default function Counter(){
    const count = useAppSelector(state => state.counter.value);
    const dispatch = useAppDispatch();

    // 初回のレンダリング後に実行
    useEffect(()=>{

        // リセットタイマー
        const timer = setInterval(()=>{
            // アクションではなく、Thunk関数を送る。
            dispatch(
                (dispatch, getState)=>{
                    const count = getState().counter.value;
                    dispatch(incrementByAmount(-count));
                }
            );
        }, 5000);

        // クリーンナップ
        return ()=>{
            clearInterval(timer);
        }

    },[dispatch]);

    return(
        <>  
            <p>Counter: {count}</p>
            <button onClick={()=> dispatch(increment())}>+</button>
            <button onClick={() => dispatch(decrement())}>-</button>
            <button onClick={() => dispatch(incrementByAmount(10))}> +10</button>
        </>
    );
}