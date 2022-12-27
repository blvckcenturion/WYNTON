import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MouseEventHandler } from 'react';

const NavigationOption = ({title, icon, onClick, active} : {title : string, icon : IconDefinition, onClick : MouseEventHandler, active : boolean}) => {
    return (
        <div className={`menu-item ${active && "active"} `} onClick={onClick}>
            <FontAwesomeIcon icon={icon} />
            <h1 className='text-xl'>{title}</h1>
        </div>
    )
}

export default NavigationOption;