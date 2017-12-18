import {SketchField, Tools, ContentUndo} from 'react-sketch';
import React, {Component} from 'react';
import {connect} from "react-redux";

class TestImage extends React.Component {
    render() {
        let {drawingsGroup} = this.props.opCanvas;
            return (
            <div>
                {
                    drawingsGroup.map((drawing, index) => {
                        return <img key={index} src={"data:image/png;base64,"+drawing.img} height={500} width={500} style={{zIndex: 20}}/>
                    })
                }
            </div>
        )
    }
}

function mapStateToProps (state) {

    return{

        opLogin: state.opLogin,
        opCanvas: state.opCanvas
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
    }

};

export default connect(mapStateToProps, mapDispatchToProps) (TestImage)