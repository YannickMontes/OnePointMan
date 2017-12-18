import React from 'react';
import {connect} from "react-redux";
import {handleauth} from "../actions/opHandleAuth";

class HandleAuthContainer extends React.Component {

    constructor(props) {
        super(props);

        this.props.handleauth();
    }

    render() {return(<div></div>)}
}

function mapStateToProps() {
    return {}
}

//fonctions
const mapDispatchToProps = (dispatch) => {
    return {
        handleauth: () => {
            dispatch(handleauth())
        }

    }
};
export default connect(mapStateToProps, mapDispatchToProps)(HandleAuthContainer)