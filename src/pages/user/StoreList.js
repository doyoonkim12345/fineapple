import React, { useEffect, useState } from "react";
import { ListContainer } from "../../components/styles/style";
import StoreContext from "../../components/StoreContext";
import { dbService } from "../../fBase";
import { checkDate } from "../../components/modules";

export default function StoreList() {
  //const allStores = useContext(MyContext)
  //전역변수를 만드는 것

  const [store, setStoreData] = useState([]);

  useEffect(() => {
    dbService
      .collection("storedata")
      .get()
      .then((snapshot) => {
        try {
          const contextArray = snapshot.docs.map(async (doc) => {
            //console.log(doc.id);
            const temp = await dbService
              .collection("rtmstoredata")
              .doc(doc.id)
              .get();

            const tempObject = {
              ...temp.data(),
              ...doc.data(),
            };
            return tempObject;
          });
          Promise.all(contextArray).then((data) => {
            setStoreData(data);
          });
        } catch (e) {}
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapCallback = (eachData) => {
    return (
      <StoreContext
        rtmData={eachData}
        storeData={eachData}
        menuUrl={eachData.menuUrl}
        imgUrl={eachData.imgUrl}
      />
    );
  };

  const sortedFrontData = store.filter((data) => {
    const checkedDate = checkDate(data);
    return (
      checkedDate.startDate < checkedDate.nowDate &&
      checkedDate.nowDate < checkedDate.endDate &&
      data.status &&
      data.ok
    );
  });

  const sortedMidData = store.filter((data) => {
    const checkedDate = checkDate(data);
    return (
      checkedDate.beforestartDate < checkedDate.nowDate &&
      checkedDate.nowDate <= checkedDate.startDate &&
      data.status &&
      data.ok
    );
  });

  const sortedEndData = store.filter((data) => {
    const checkedDate = checkDate(data);
    return (
      (!(
        checkedDate.beforestartDate < checkedDate.nowDate &&
        checkedDate.nowDate < checkedDate.endDate
      ) ||
        !data.status) &&
      data.ok
    );
  });

  const menulist = sortedFrontData
    .concat(sortedMidData)
    .concat(sortedEndData)
    .map(mapCallback);

  return (
    <>
      <ListContainer>{menulist}</ListContainer>
    </>
  );
}
