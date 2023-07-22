const Register = () => {
    return ( 
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Register</h2>
            <form action="">
            <label htmlFor="name">
                <input type="text" name="name" />
                </label>
                <label htmlFor="address">
                <input type="text" name="address" />
                </label>
                <label htmlFor="email">
                <input type="text" name="email" />
                </label>
                <label htmlFor="password">
                <input type="text" name="password"/>
                </label>
                <Link to="register">
              
              </Link>
            <div className="card-actions">
              <button className="btn btn-primary">Register</button>
              
            </div>
                </form>
          </div>
        </div>
             );
}

export default Register