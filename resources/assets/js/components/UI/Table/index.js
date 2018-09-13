import React from 'react'

const Table = ({ headers, data }) => {
    console.log(headers, data);
    
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
                        <td>{each.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table