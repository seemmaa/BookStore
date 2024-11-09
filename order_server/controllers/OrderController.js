const axios = require('axios');

exports.purchase = async (req, res) => {
    const item_id = req.params.id; // Get item_id from the route parameters

    try {
        // Query the catalog server to verify stock
        const response = await axios.get(`http://localhost:3000/CATALOG_WEBSERVICE_IP/info/${item_id}`);
    
        // Log the response to check its structure
        console.log('Catalog response:', response.data);
        
        // Ensure that the response contains the expected structure
        const bookInfo = response.data.information;

        if (bookInfo) {
            // Check if the item is in stock
            if (bookInfo.count <= 0) {
                return res.status(400).json({ message: 'Item is out of stock.' });
            }

            //// Decrement the stock count by one
            const updatedCount = bookInfo.count - 1;

            // Send a PUT request to update the stock in the catalog server
            await axios.put(`http://localhost:3000/CATALOG_WEBSERVICE_IP/updateCount/${item_id}`, {
                count: updatedCount
            });
            const { count, ...responseData } = bookInfo; // Exclude count
            await axios.put(`http://localhost:3001/CATALOG_WEBSERVICE_IP/updateCount/${item_id}`, {
                count: updatedCount
            });
            
            return res.status(200).json({ message: 'Purchase successful!', item: responseData  });
        } else {
            return res.status(404).json({ message: 'Book not found.' });
        }
    } catch (error) {
        console.error('Error during purchase:', error.message);
        if (error.response) {
            // The catalog server responded with an error status
            return res.status(error.response.status).json({ error: error.response.data });
        }
        // If there's an issue with the request itself
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
