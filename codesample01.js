// IF/THEN

/*
  The easiest way to have conditional rendering is to use an if/else in your render method.

  For instance, a List component that shouldn't render the list when there is no list.
*/

function List ({ list }) {
  if (!list) {
    return null;
  }

  return (
    <div>
      { list.map(item => <ListItem item={item} />) }
    </div>
  )
} // ...etc

// Next item of business he gets into the ternary, and then &&

// The logical && operactor helps to make conditions that would return null more concise.

function LoadingIndicator({ isLoading }) {
  return (
    <div>
      { isLoading && <p>Loading...</p>}
    </div>
  )
} // "short circuit evaluation". -- the way to go when you want to return an element or nothing.

// Switch/case:

function Notification({ text, state }) {
  switch(state) {
    case 'info':
      return <Info text={ text } />
    case 'warning':
      return <Warning text={ text } />
    case 'error':
      return <Error text={ text } />
    default: //always use a default!  A React component always has to return an element or null.
      return null
  }
}

// When a component has a conditional rendering based on a state, it makes sense to describe the interface of the 
// component with React.propTypes

Notification.propTypes = {
  text: React.PropTypes.string,
  state: React.PropTypes.oneOf(['info', 'warning', 'error'])
}

// An alternative way would be to inline the switch/case.  You need a self-invoking JavaScript function:

function Notification( {text, state }) {
  return (
    <div>
      {( function() {
        switch(state) {
          case: 'info':
            return <Info text={text} />
          case: 'warning':
            return <Warning text={text} />
          case 'error':
            return <Error text={text} />
          default:
            return null
        }
      }
      )()}
    </div>
  )
}

// It's even more concise with an ES 6 arrow function
function Notification({ text, state }) {
  return (
      <div>
        {(() => {
          switch(state) {
            case: 'info':
              return <Info text={text} />
            case: 'warning':
              return <Warning text={text} />
            case 'error':
              return <Error text={text} />
            default:
              return null
          }
        })()}
      </div>
    )
}

// Conditional Rendering with Enumeration
// In JS an object can be used as an enum when the object is used as a map of key/value pairs.

const ENUM = {
  a: '1',
  b: '2',
  c: '3'
}

function notification({ text, state }) {
  return (
    <div>
      {{
        info: <Info text={ text } />,
        warning: <Warning text={ text } />
        error: <Error text={ text } />
      }[state]}
    </div>
  )
}

/* 
  The state property retrieves the value from the object.  It is so much more reliable than the switch/case
  operator.  (Whatever that means?)
*/

// If you can't depend on the text property inline like in the last example, you can use an external static enum instead:

const NOTIFICATION_STATES = {
  info: <Info />,
  warning: <Warning />,
  error: <Error />
}

function Notification ({ state }) {
  return (
    <div>
      { NOTIFICATION_STATES[state] } // This must be that external static enum thingie
    </div>
  )
}

// We can write a function to retrieve the value, but we can also depend on the text property
const getSpecificNotification = (text) => ({
  info: <Info text={ text } />,
  warning: <Warning text={ text } />,
  error: <Error text={ text } />
})

function Notification({ state, text }) {
  return (
    <div>
      { getSpecificNotification(text)[state]}
    </div>
  )
}

// Objects as enums open up plenty of options for multiple conditional renderings.  For example:
function FooBarOrFooOrBar({ isFoo, isBar }) {
  const key = `${isFoo}-${isBar}`
  return (
    <div>
      {{
        ['true-true']: <FooBar />,
        ['true-false']: <Foo />,
        ['false-true']: <Bar />
        ['false-false']: null
      }[key]}
    </div>
  )
}

FooBarOrFooOrBar.propTypes = {
  isFoo: React.PropTypes.boolean.isRequired,
  isBar: React.PropTypes.boolean.isRequired
}

// Multi-level Conditional Rendering in React
// Nested consitional renderings are possible.  This List component can show a list, empty text, or null.
function List({ list }) {
  const isNull = !list
  const isEmpty = !isNull && !list.length

  return (
    <div>
      { isNull
        ? null
        : ( isEmpty
          ? <p>Sorry, the list is empty</p>
          : <div>{ list.map(item => <ListItem item={ item } />)}</div>
        )
      }
    </div>
  )
}

// Usage
<List list={ null } /> // <div></div>
<List list={[]} /> // <div> 
<List list={[ 'foo', 'bar', 'baz' ]} /> //<div><div>foo</div><div>bar</div><div>baz</div></div>

// That works, but it's kinda hairy.  Best to keep nested conditional renderings to a minimum.  
// You can split the last example up into smaller components which themselves have conditional renderings.

function List({ list }) {
  const isList = list && list.length

  return (
    <div>
      { isList
        ? <div>{ list.map(item => <ListItem item={item} />)}</div>
        : <NoList isNull={!list} isEmpty={ list && !list.length } />
      }
    </div>
  )
}

function NoList({ isNull, isEmpty }) {
  return (!isNull && isEmpty) && <p>Sorry, the list is empty.</p>
}

// Still a bit hairy.  Time for:

// Higher Order Components

// This HOC either shows a loading indicator or a desired component.

// HOC declaration
function withLoadingIndicator(Component) {
  return function EnhancedComponent({ isLoading, ...props }) {
    if (!isLoading) {
      return <Component { ...props } />
    }
    return <div><p>Loading...</p></div>
  }
}

// Usage
const ListWithLoadingIndicator = withLoadingIndicator(List)

<ListWithLoadingIndicator
  isLoading={ props.isLoading }
  list={ props.list }
/>

/* 
  In this example the List component can focus on rendering the list.  It doesn't have to bother
  with a loading state.  Ultimately, you could add more HOCs to deal with multiple conditional 
  rendering edge cases.

  An HOC can opt-in one or multiple conditional renderings.  You could even use multipe HOCs to 
  handle several conditional renderings.  An HOC shields away all of the noise from your components.
*/

