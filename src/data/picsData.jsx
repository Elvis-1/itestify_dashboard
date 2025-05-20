import videocard from '../assets/images/videocard.png'
import mycover from '../assets/images/videocover.png'
import { IoIosMore } from "react-icons/io";

let picturesData = [
    {
        id: 1,
        thumbnail: videocard,
        mycover:mycover,
        source: 'Instagram',
        date_uploaded: '24/12/05',
        uploaded_by: 'Elvis/Super Admin',
        downloads: 15,
        shares: 15,
        status: 'Uploaded',
        action: <IoIosMore />
    },
    {
        id: 2,
        thumbnail: videocard,
        mycover:mycover,
        source: 'Pinterest',
        date_uploaded: '24/12/05',
        uploaded_by: 'Elvis/Super Admin',
        date_scheduled: '08/08/24',
        time: '09:00',
        downloads: 'N/A',
        shares: 'N/A',
        status: 'Schedule',
        action: <IoIosMore />
    },
    {
        id: 3,
        thumbnail: videocard,
        mycover:mycover,
        source: 'Shutterstock',
        date_uploaded: '24/12/05',
        uploaded_by: 'Elvis/Super Admin',
        downloads:'N/A',
        shares: 'N/A',
        status: 'Draft',
        action: <IoIosMore />
    },

    {
        id: 4,
        thumbnail: videocard,
        mycover:mycover,
        source: 'Pinterest',
        date_uploaded: '24/12/05',
        uploaded_by: 'Elvis/Super Admin',
        downloads: 15,
        shares: 15,
        status: 'Uploaded',
        action: <IoIosMore />
    },
    
]
export default  picturesData