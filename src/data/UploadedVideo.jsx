import videocard from '../assets/images/videocard.png'
import mycover from '../assets/images/videocover.png'
import { IoIosMore } from "react-icons/io";

let uploadedVideo = [
    {
        id: 1,
        thumbnail: videocard,
        mycover:mycover,
        title: 'God healed me',
        category: 'Healing',
        source: 'Youtube',
        date_uploaded: '2024-12-09',
        uploaded_by: 'Super Admin' ,
        views: 20,
        likes:15,
        comments:15,
        shares:15,
        action: <IoIosMore />
    },
    {
        id: 2,
        thumbnail: videocard,
        mycover:mycover,
        title: 'God healed me',
        category: 'Deliverance',
        source: 'Youtube',
        date_uploaded: '2024-12-05',
        uploaded_by: 'Super Admin',
        views: 20,
        likes:15,
        comments:15,
        shares:15,
        action: <IoIosMore />
    },
    {
        id: 3,
        thumbnail: videocard,
        mycover:mycover,
        title: 'God saved me',
        category: 'Healing',
        source: 'Youtube',
        date_uploaded: '2024-12-07',
        uploaded_by: 'Super Admin',
        views: 20,
        likes:15,
        comments:15,
        shares:15,
        action: <IoIosMore />
    },

    {
        id: 4,
        thumbnail: videocard,
        videocover:mycover,
        title: 'God healed me',
        category: 'Healing',
        source: 'Youtube',
        date_uploaded: '2024-12-09',
        uploaded_by: 'Super Admin',
        views: 20,
        likes:15,
        comments:15,
        shares:15,
        action: <IoIosMore />
    },
    
]
export default uploadedVideo