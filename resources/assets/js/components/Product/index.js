import React, { Component } from "react";
import axios from "axios";
import Button from '@material-ui/core/Button'

import Table from "../UI/Table";
import "./styles.css";
import Spinner from "../UI/Spinner";
import TextInput from "../UI/Input";
import Modal from '../UI/Modal/index';

class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headers: ["id", "Name", "Description"],
            data: [{ id: "1", name: "Aayush Garg", description: "A Front End Developer" }],
            axios: false,
            create: false,
            selectUserType: null,
            show: false,
            name: '',
            description: ''
        };

        this.editItem = this.editItem.bind(this)
        this.updateItem = this.updateItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.createItem = this.createItem.bind(this)
        this.onCreateProduct = this.onCreateProduct.bind(this)
        this.onSubmitProduct = this.onSubmitProduct.bind(this)
    }

    componentDidMount() {
        this.setState({
            axios: true
        });
        axios({
            url: `/api/products`,
            method: "GET"
        }).then(response => {
            console.log('response', response.data);
            let data = [];
            data.push.apply(data, response.data.data.users);
            this.setState({
                data,
                axios: false
            });
        }).catch(err => {
            console.log(err);
            this.setState({
                axios: false
            })
        })
    }

    editItem() {

    }
    updateItem() {

    }

    deleteItem() { }
    createItem() { }

    onCreateProduct() {
        this.setState({ show: true })
    }

    onSubmitProduct() {
        this.setState({ show: false })
    }

    render() {
        console.log('state', this.state);
        console.log('props', this.props);

        const { headers, data, axios, show } = this.state;

        return !axios
            ? (
                <div className="Container">
                    <div className="ButtonContainer">
                        <Button
                            onClick={this.onCreateProduct}
                            variant="contained"
                            color="default"
                            className="button">
                            Create User
                        </Button>
                    </div>
                    <div className="MainContainer">
                        <div className="TableList">
                            <Table headers={headers} data={data} />
                        </div>
                    </div>
                    <Modal show={show}>
                        <div className="InputForm">
                            <TextInput type="text" placeholder="Name" />
                            <TextInput type="text" placeholder="Description" />
                            <div className="FormButton">
                                <Button variant="contained" onClick={this.onSubmitProduct}>Create</Button>
                            </div>
                        </div>
                    </Modal>
                </div>
            )
            : (
                <div className="SpinnerContainer">
                    <Spinner />
                </div>
            );
    }
}

export default Products;
