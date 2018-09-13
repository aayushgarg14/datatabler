import React, { Component, Fragment } from "react";
import axios from "axios";
import Button from '@material-ui/core/Button'

import Table from "../../components/Table";
import "./styles.css";
import Spinner from "../../components/Spinner";
import TextInput from "../../components/Input";
import Modal from '../../components/Modal';

class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headers: ["id", "Name", "Quantity", "Description"],
            data: [],
            axios: false,
            create: false,
            edit: false,
            selectUserType: null,
            show: false,
            name: '',
            quantity: '',
            description: ''
        };

        this.updateInputHandler = this.updateInputHandler.bind(this)
        this.editItem = this.editItem.bind(this)
        this.updateItem = this.updateItem.bind(this)
        this.deleteItem = this.deleteItem.bind(this)
        this.onCreateProduct = this.onCreateProduct.bind(this)
        this.onProductManipulate = this.onProductManipulate.bind(this)
        this.onCloseModal = this.onCloseModal.bind(this)
    }

    componentDidMount() {
        this.setState({
            axios: true
        });
        axios.get('/api/products').then(response => {
            console.log('response', response.data);
            let data = [];
            data.push.apply(data, response.data);
            this.setState({
                data,
                axios: false
            });
        }).catch(err => {
            console.log(err.response);
            this.setState({
                axios: false
            })
        })
    }

    updateInputHandler(key, event) {
        console.log('key, value: ', key, event.target.value);
        var partialState = {};
        partialState[key] = event.target.value;
        this.setState(partialState);
    }

    editItem() {

    }
    updateItem() {

    }

    deleteItem() { }

    onCreateProduct() {
        this.setState({ show: true, create: true, edit: false })
    }

    onProductManipulate(type) {
        const { name, quantity, description } = this.state
        let data = {}
        switch (type) {
            case 'create':
                data = {
                    name, quantity, description
                }
                console.log(data);

                axios.post('/api/products', data).then(response => {
                    console.log(response);
                }).catch(err => {
                    console.log(err.response);
                })
                break;

            default:
                break;
        }
        this.setState({ show: false })
    }

    onCloseModal() {
        this.setState({ show: false })
    }

    renderModal(type) {
        const { name, description, quantity, show } = this.state
        console.log('state', this.state);

        return (
            <Modal show={show}>
                <div className="InputForm">
                    {type === 'delete'
                        ? <div>Are you sure you want to delete?</div>
                        : <Fragment>
                            <TextInput
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(val) => this.updateInputHandler('name', val)} />
                            <TextInput
                                type="number"
                                placeholder="Quantity"
                                value={quantity}
                                onChange={(val) => this.updateInputHandler('quantity', val)} />
                            <TextInput
                                type="text"
                                placeholder="Description"
                                value={description}
                                onChange={(val) => this.updateInputHandler('description', val)} />
                        </Fragment>
                    }
                    <div className="FormButton">
                        <div className="FormButtonEach">
                            <Button variant="contained" onClick={() => this.onProductManipulate(type)}>
                                {type === 'create'
                                    ? 'Create'
                                    : 'edit'
                                        ? 'Edit'
                                        : 'Delete'
                                }
                            </Button>
                        </div>
                        <div className="FormButtonEach">
                            <Button variant="contained" onClick={this.onCloseModal}>
                                Cancel
                        </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }

    render() {
        const { headers, data, axios, create, edit } = this.state;
        const type = create
            ? 'create'
            : edit
                ? 'edit'
                : 'delete'

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
                        {!data.length
                            ? <div className="NoProducts">No Products To Display!!!</div>
                            : <div className="TableList">
                                <Table headers={headers} data={data} />
                            </div>
                        }
                    </div>
                    {this.renderModal(type)}
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
