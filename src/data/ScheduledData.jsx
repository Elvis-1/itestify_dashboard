import videocard from '../assets/images/videocard.png'
import mycover from '../assets/images/videocover.png'
import { IoIosMore } from "react-icons/io";

let scheduledVideo = [
    {
        id: 1,
        thumbnail: videocard,
        mycover:mycover,
        title: 'God healed me',
        category: 'Healing',
        source: 'Youtube',
        scheduled_date: '2024-12-09',
        time:'08:00 PM',
        action: <IoIosMore />
    },
    {
        id: 2,
        thumbnail: videocard,
        mycover:mycover,
        title: 'God healed me',
        category: 'Deliverance',
        source: 'Youtube',
        scheduled_date: '2024-12-09',
        time:'08:00 PM',
        action: <IoIosMore />
    },
    {
        id: 3,
        thumbnail: videocard,
        mycover:mycover,
        title: 'God saved me',
        category: 'Healing',
        source: 'Youtube',
        scheduled_date: '2024-12-05',
        time:'08:00 PM',
        action: <IoIosMore />
    },

    {
        id: 4,
        thumbnail: videocard,
        videocover:mycover,
        title: 'God healed me',
        category: 'Healing',
        source: 'Youtube',
        scheduled_date: '2024-12-07',
        time:'08:00 PM',
        action: <IoIosMore />
    },
    
]
export default scheduledVideo