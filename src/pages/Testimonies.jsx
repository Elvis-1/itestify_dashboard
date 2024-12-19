import React, { useState } from 'react'

function Testimonies() {
    const [showAllTestimonies, setShowAllTestimonies] = useState(true)

  return (
    <div>
        <div>All Testimonies</div>
        <div>Upload Testimonies</div>
    </div>
  )
}

export default Testimonies