import PropTypes from 'prop-types';

const StaticUserInfo = ({ user }) => {
    return (
        <div>
            <div className='d-flex'>
                <img className='rounded d-block img-thumbnail mx-auto' src={user.image} />
            </div>
            <div className='mt-3'>
                <h1>{`${user.firstName} ${user.lastName}`}</h1>
            </div>
            <div className='w-100 text-center mx-auto'>
                <small>{user.email}</small>
            </div>
        </div>
    )
}

StaticUserInfo.propTypes = {
    user: PropTypes.object.isRequired
}

export default StaticUserInfo;