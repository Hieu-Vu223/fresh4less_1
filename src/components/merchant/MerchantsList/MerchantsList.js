import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebaseConfig';

const MerchantsList = () => {
    const [merchants, setMerchants] = useState([]);
    const [selectedMerchant, setSelectedMerchant] = useState(null);
    const [offers, setOffers] = useState([]);

    // Fetch merchants from Firestore
    const fetchMerchants = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Merchants"));
            const merchantsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMerchants(merchantsData);
        } catch (error) {
            console.error("Error fetching merchants:", error);
        }
    };

    // Fetch offers from Firestore
    const fetchOffers = async (merchantId) => {
        try {
            const querySnapshot = await getDocs(
                collection(db, `Merchants/${merchantId}/foodOffers`)
            );
            const offersData = querySnapshot.docs.map(doc => doc.data());
            setOffers(offersData);
        } catch (error) {
            console.error("Error fetching offers:", error);
        }
    };

    // Fetch merchants on component mount
    useEffect(() => {
        fetchMerchants();
    }, []);

    // Handle merchant selection
    const handleMerchantClick = (merchant) => {
        setSelectedMerchant(merchant.name);
        fetchOffers(merchant.id);
    };

    return (
        <div>
            <h1>Merchants</h1>
            <ul>
                {merchants.map(merchant => (
                    <li key={merchant.id}>
                        <button onClick={() => handleMerchantClick(merchant)}>
                            {merchant.name}
                        </button>
                    </li>
                ))}
            </ul>

            {selectedMerchant && (
                <div>
                    <h2>Offers from {selectedMerchant}</h2>
                    <ul>
                        {offers.map((offer, index) => (
                            <li key={index}>{offer.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MerchantsList;
