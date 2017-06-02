import React from 'react';
import { _ } from 'meteor/underscore';
import { Accounts, STATES } from 'meteor/std:accounts-ui';

/**
 * Form.propTypes = {
 *   fields: React.PropTypes.object.isRequired,
 *   buttons: React.PropTypes.object.isRequired,
 *   error: React.PropTypes.string,
 *   ready: React.PropTypes.bool
 * };
 */
class Form extends Accounts.ui.Form {
  render() {
    const {
      hasPasswordService,
      oauthServices,
      fields,
      buttons,
      error,
      ready = true,
      className,
      formState,
      messages
    } = this.props;
    return (
      <form ref={(ref) => this.form = ref} className={[ "accounts ui form", className ].join(' ')}>
        {Object.keys(fields).length > 0 && (
          <Accounts.ui.Fields fields={ fields } />
        )}
        {buttons['switchToPasswordReset'] && (
          <div className="field">
            <Accounts.ui.Button {...buttons['switchToPasswordReset']} />
          </div>
        )}
        {_.values(_.omit(buttons, 'switchToPasswordReset', 'switchToSignIn',
        'switchToSignUp', 'switchToChangePassword', 'switchToSignOut', 'signOut')).map((button, i) =>
          <Button {...button} key={i} />
        )}
        {buttons['signOut'] && (
          <Button {...buttons['signOut']} type="submit" />
        )}
        {buttons['switchToSignIn'] && (
          <Button {...buttons['switchToSignIn']} type="link" className="ui button" />
        )}
        {buttons['switchToSignUp'] && (
          <Button {...buttons['switchToSignUp']} type="link" className="ui button" />
        )}
        {buttons['switchToChangePassword'] && (
          <Button {...buttons['switchToChangePassword']} type="link" className="ui button" />
        )}
        {buttons['switchToSignOut'] && (
          <Button {...buttons['switchToSignOut']} type="link" className="ui button" />
        )}
        {(formState == STATES.SIGN_IN || formState == STATES.SIGN_UP) && (
          <div className="or-sep">
            <Accounts.ui.PasswordOrService oauthServices={ oauthServices } />
          </div>
        )}
        {(formState == STATES.SIGN_IN || formState == STATES.SIGN_UP) && (
          <Accounts.ui.SocialButtons oauthServices={ oauthServices } />
        )}
        <Accounts.ui.FormMessages
          className="ui message"
          style={{ display: 'block' }}
          messages={messages}
        />
      </form>
    );
  }
}

class Buttons extends Accounts.ui.Buttons {}
class Button extends Accounts.ui.Button {
  render() {
    const {
      label,
      href = null,
      type,
      disabled = false,
      onClick,
      className,
      icon
    } = this.props;
    return type == 'link' ? (
      <a
        href={href}
        style={{cursor: 'pointer'}}
        className={className}
        onClick={onClick}
      >
        {icon && (<i className={["icon", icon].join(' ')} />)}{label}
      </a>
    ) : (
      <button
        className={[
          'ui button',
          type == 'submit' ? 'primary' : '',
          disabled ? 'disabled' : '',
          className
          ].join(' ')}
        type={type} 
        disabled={disabled}
        onClick={onClick}>{icon && (<i className={["icon", icon].join(' ')} />)}{label}</button>
    );
  }
}

class Fields extends Accounts.ui.Fields {
  render () {
    let { fields = {}, className = "field" } = this.props;
    return (
      <div className={ className }>
        {Object.keys(fields).map((id, i) =>
          <Accounts.ui.Field {...fields[id]} key={i} />
        )}
      </div>
    );
  }
}

class Field extends Accounts.ui.Field {
  render() {
    const {
      id,
      hint,
      label,
      type = 'text',
      onChange,
      required = false,
      className,
      defaultValue = "",
      message
    } = this.props;
    const { mount = true } = this.state;
    return mount ? (
      <div className={["ui field", required ? "required" : ""].join(' ')}>
        <label htmlFor={ id }>{ label }</label>
        <div className="ui fluid input">
          <input id="password" name="password" style={{display: 'none'}} />
          <input id={ id }
            name={ id }
            type={ type }
            ref={ (ref) => this.input = ref }
            autoCapitalize={ type == 'email' ? 'none' : false }
            autoCorrect="off"
            onChange={ onChange }
            placeholder={ hint } defaultValue={ defaultValue } />
        </div>
        {message && (
          <span className={['message', message.type].join(' ').trim()}>
            {message.message}
          </span>
        )}
      </div>
    ) : null;
  }
}

export class PasswordOrService extends Accounts.ui.PasswordOrService {
  render() {
    const { className, style = {} } = this.props;
    const { hasPasswordService, services } = this.state;
    let labels = services;
    if (services.length > 2) {
      labels = [];
    }

    if (hasPasswordService && services.length > 0) {
      return (
        <p style={style} className={className}>
          {`${T9n.get('orUse')} ${ labels.join(' / ') }`}
        </p>
      );
    }
    return null;
  }
}

class SocialButtons extends Accounts.ui.SocialButtons {
  render() {
    let { oauthServices = {}, className = "social-buttons" } = this.props;
    return(
      <div className={ className }>
        {Object.keys(oauthServices).map((id, i) => {
          var mapObj = {
            google:"google plus",
            "meteor-developer": ""
          };
          let serviceClass = id.replace(/google|meteor\-developer/gi, (matched) => {
            return mapObj[matched];
          });
          return (
            <Accounts.ui.Button
              key={i}
              className={["ui button", serviceClass].join(' ')}
              icon={serviceClass} {..._.omit(oauthServices[id], "className")}
            />
          );
        })}
      </div>
    );
  }
}

class FormMessage extends Accounts.ui.FormMessage {
  render () {
    let { message, type, className = "message", style = {} } = this.props;
    message = _.isObject(message) ? message.message : message; // If message is object, then try to get message from it
    return message && (
      <div
        className="ui message"
        style={{ display: 'block' }}
      >
        {message}
      </div>
    );
  }
}

class FormMessages extends Accounts.ui.FormMessages {
  render () {
    const { messages = [], className = "messages", style = {} } = this.props;
    return messages.length > 0 && (
      <div className="messages">
        {messages
          .map(({ message, type }, i) =>
            <Accounts.ui.FormMessage
              message={message}
              type={type}
              key={i}
            />
          )}
      </div>
    );
  }
}

// Notice! Accounts.ui.LoginForm manages all state logic at the moment, so avoid
// overwriting this one, but have a look at it and learn how it works. And pull
// requests altering how that works are welcome.

// Alter provided default unstyled UI.
Accounts.ui.Form = Form;
Accounts.ui.Buttons = Buttons;
Accounts.ui.Button = Button;
Accounts.ui.Fields = Fields;
Accounts.ui.Field = Field;
Accounts.ui.PasswordOrService = PasswordOrService;
Accounts.ui.SocialButtons = SocialButtons;
Accounts.ui.FormMessages = FormMessages;
Accounts.ui.FormMessage = FormMessage;

// Export the themed version.
export { Accounts, STATES };
export default Accounts;
