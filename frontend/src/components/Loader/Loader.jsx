import React from 'react'

import { ThreeCircles } from 'react-loader-spinner'

const Loader = ({ h, w, color }) => {
    return (
        <ThreeCircles
            height={h || "22"}
            width={w || "22"}
            color={color || "red"}
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
        />
    )
}

export default Loader