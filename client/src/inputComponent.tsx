import React, {Component} from 'react';
import './inputComponent.css';

type inputComponentProps = {
  fieldName: string;
};

function getPlaceholder(fieldName: string): string {
  return 'Enter ' + fieldName;
}

function getID(fieldName: string): string {
  return fieldName + 'Input';
}

export default class inputComponent extends Component<inputComponentProps> {
  render() {
    return (
      <div id="inputComponentWrapper">
        <p>{this.props.fieldName}</p>
        <input
          className="inputFields"
          name={this.props.fieldName}
          id={getID(this.props.fieldName)}
          placeholder={getPlaceholder(this.props.fieldName)}
        ></input>
      </div>
    );
  }
}
