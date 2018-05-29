import * as React from "react";

interface Iprops extends React.Props<LoginForm> {
  location: any
}
interface Istate {
  redirectToReferrer: boolean;
}

class LoginForm extends React.Component <Iprops, Istate >{
}

export default LoginForm;