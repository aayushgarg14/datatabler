import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const Table = ({ headers, data, onEditDetails, onDeleteProduct }) => {
    console.log(headers);

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    {headers.map((each, index) => (
                        <th key={index}>{each}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map(each => (
                    <tr key={each.id}>
                        <td>{each.id}</td>
                        <td>{each.name}</td>
                        <td>{each.quantity}</td>
                        <td>{each.description}</td>
                        <td>
                            <IconButton onClick={() => onEditDetails(each.id)} aria-label="Edit">
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => onDeleteProduct(each.id)} aria-label="Delete">
                                <DeleteIcon />
                            </IconButton>
                            {/* <Button onClick={onEditDetails}>Edit</Button>
                            <Button onClick={onDeleteProduct}>Delete</Button> */}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table