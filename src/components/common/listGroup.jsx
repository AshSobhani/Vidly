import React from "react";

const ListGroup = ({
	items,
	textProperty,
	valueProperty,
	onItemSelect,
	selectedGenre
}) => {
	return (
		<div>
			<ul className="list-group">
				{items.map(item => (
					<li
						onClick={() => onItemSelect(item)}
						key={item[valueProperty]}
						className={
							item === selectedGenre
								? "list-group-item active"
								: "list-group-item"
						}
					>
						{item[textProperty]}
					</li>
				))}
			</ul>
		</div>
	);
};

ListGroup.defaultProps = {
	textProperty: "name",
	valueProperty: "_id"
};

export default ListGroup;
