import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const MenuItem = ({title, icon, onClick, active}) => {
    return (
        <div className={`menu-item ${active && "active"} `} onClick={onClick}>
            <FontAwesomeIcon icon={icon} />
            <h1 className='text-xl'>{title}</h1>
        </div>
    )
}

export default MenuItem;