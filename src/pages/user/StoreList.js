import React, { useEffect, useState }  from 'react';
import {ListContainer, TitleContainer} from '../../components/style'
import StoreContext from '../../components/StoreContext';
import { dbService } from '../../fBase';

//export const MyContext = createContext(stores)

export default function StoreList(){
    
    //const allStores = useContext(MyContext)
    //전역변수를 만드는 것

    const [rtmData, setRtmData] = useState([])
    const [store, setStoreData] = useState([])

    useEffect(() => {

            setTimeout(
                    () => {
                            dbService
                             .collection("rtmstoredata")
                             .get().then((snapshot) => {
                               try {
                                 const contextArray = snapshot.docs.map((doc) => {
                                    
                                    return {
                                     ...doc.data(), 
                                   }
                                   }
                                 );
                                setRtmData(contextArray)
                                //console.log(snapshot)
                               } catch (e) {
                                 console.log(e);
                               }
                               
                             });

                             dbService
                             .collection("storedata")
                             .get().then((snapshot) => {
                               try {
                                 const contextArray = snapshot.docs.map((doc) => {
                                    
                                    return {
                                     ...doc.data(), 
                                   }
                                   }
                                 );
                                setStoreData(contextArray)
                                //console.log(snapshot)
                               } catch (e) {
                                 console.log(e);
                               }
                               
                             });
                            
                            } ,0)
            

    }, [])
    
    const mapCallback = (eachData)=>{
        const storeData = store.find(x => x.id === eachData.createrId)
        return <StoreContext rtmData={eachData} storeData={storeData}/>
    }

    const checkAm = (isAM, time) => {
      let countTime = parseInt(time)
      if(isAM){
          countTime += 12
      } 
      return countTime
    }

    const sortedFrontData = rtmData.filter((data)=>{

                let nowDate = new Date()//현재시간

                nowDate = nowDate.getTime()

                let startDate = new Date()//이벤트 시작 시간
                startDate.setHours(checkAm(data.startAm, data.startTime-2), 0,0)

                let endDate = new Date()//이벤트 끝나는 시간
                endDate.setHours(checkAm(data.endAm, data.endTime), 0, 0)

                if(endDate <= startDate){
                    endDate.setTime(endDate.getTime()+(1000 * 60 * 60 * 24))
                }

                console.log(checkAm(data.startAm, data.startTime-2), checkAm(data.endAm, data.endTime))

                return startDate < nowDate  && nowDate < endDate

    })

    const sortedEndData = rtmData.filter((data)=>{

      let nowDate = new Date()//현재시간

      nowDate = nowDate.getTime()

      let startDate = new Date()//이벤트 시작 시간
      startDate.setHours(checkAm(data.startAm, data.startTime-2), 0,0)

      let endDate = new Date()//이벤트 끝나는 시간
      endDate.setHours(checkAm(data.endAm, data.endTime), 0, 0)

      if(endDate <= startDate){
          endDate.setTime(endDate.getTime()+(1000 * 60 * 60 * 24))
      }

      console.log(checkAm(data.startAm, data.startTime-2), checkAm(data.endAm, data.endTime))

      return !(startDate < nowDate  && nowDate < endDate)

})



    const menulist = sortedFrontData.concat(sortedEndData).map(mapCallback)


    return(
        <>
            <TitleContainer>FineApple</TitleContainer>
            <ListContainer>
                {menulist}
            </ListContainer>
        </>
    )
}