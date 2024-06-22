import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DrugDetails = ({ query }) => {
  const { drug_name } = useParams();
  const [drugInfo, setDrugInfo] = useState(null);
  const [ndcs, setNdcs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrugInfo = async () => {
      try {
        setError("");

        // const response = await axios.get(
        //   `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${drug_name}`
        // );
        const response = await axios.get(
          `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${query}`
        );
        console.log("Drug Info", response.data);

        const drugGroup = response.data.drugGroup.conceptGroup || [];
        console.log("drugGroup", drugGroup);
        const drug =
          drugGroup.length > 0 ? drugGroup[2].conceptProperties[0] : null;
        console.log("drug", drug);
        setDrugInfo(drug);

        if (drug) {
          const ndcResponse = await axios.get(
            `https://rxnav.nlm.nih.gov/REST/rxcui/${drug.rxcui}/ndcs.json`
          );

          console.log("NDC:", ndcResponse.data);

          setNdcs(ndcResponse.data.ndcGroup.ndcList || []);
        } else {
          setError("No drug information found.");
        }
      } catch (error) {
        console.error("Error fetching drug info:", error);
        setError("An error occurred while fetching drug information.");
      }
    };

    fetchDrugInfo();
  }, [drug_name]);

  return (
    <div className="mt-10 m-36">
      {error && <div className="text-red-500">{error}</div>}
      {drugInfo ? (
        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold">{drugInfo.name}</h1>
          <p>RxCUI: {drugInfo.rxcui}</p>
          <p>Synonym: {drugInfo.synonym}</p>
          <h2 className="mt-5 text-xl font-semibold">NDCs</h2>
          {ndcs.length > 0 ? (
            ndcs.map((ndc) => <li key={ndc}>{ndc}</li>)
          ) : (
            <li>No NDCs found</li>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default DrugDetails;
