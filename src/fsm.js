class FSM {
  constructor(config) {

    let self = this;

    if (!arguments.length) {
      throw new Error("config is not passed")
    }
    this.pozHistory = 0;
    this.initialState = config.initial;
    this.history = [];

    this.arrOfAllStates = [];
    this.allState = config.states;
    this.allStateString = Object.keys(config.states);


    this.allStateString.forEach(function (item, index) {
      let objState = self.allState[item];
      self.arrOfAllStates.push([item, objState])


    });
    this.state = {
            [this.initialState]: this.allState[this.initialState]
    };

  }

  getState() {
    return (Object.keys(this.state)[0])
  }

  changeState(state) {
    if (state == Object.keys(this.state)[0]){
        return
        }
    if (this.allStateString.indexOf(state) == -1) {
      throw new Error("I do not know this state")
    }

    this.state = {
      [state]: this.allState[state]
    }
    if (this.history.length == 0) {
      this.history.push(this.initialState);
      this.history.push(state);
      this.pozHistory = this.pozHistory + 1;

      return
    }
    if (state == this.history[this.pozHistory + 1]) {
      this.pozHistory = this.pozHistory + 1;
      return false
    }

    this.history.push(state);
    this.pozHistory = this.pozHistory + 1;


  }


  trigger(event) {

    let allEventsFromCurState = Object.keys(Object.values(this.state)[0].transitions);
    if (allEventsFromCurState.indexOf(event) == -1) {
      throw new Error("I do not know this event");
    }

    let newState = Object.values(this.state)[0].transitions[event];

    this.changeState(newState);

  }


  reset() {
    this.changeState(this.initialState);

  }

  getStates(event) {
    let arrResult = [];
    if (arguments.length == 0) return (this.allStateString);
    this.arrOfAllStates.forEach(function (item) {
      let nameState = item[0];
      let objOfTransition = item[1].transitions
      if (objOfTransition[event]) {
        arrResult.push(nameState)
      };


    });
    return arrResult



  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    let history = this.history;
    let curPosHistory = this.pozHistory;
    let newPosHistory = curPosHistory - 1;

    if (history.length == 0) {
      return false
    }
    if (newPosHistory < 0) {
      return false
    }
    this.state = {
      [history[newPosHistory]]: this.allState[[history[newPosHistory]]]
    };
    this.pozHistory = newPosHistory;
    return true

  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    let history = this.history;
    let curPosHistory = this.pozHistory;
    let newPosHistory = curPosHistory + 1;

    if (history.length == 0) {
      return false
    }
    if (newPosHistory >= history.length) {
      return false
    }
    this.state = {
      [history[newPosHistory]]: this.allState[[history[newPosHistory]]]
    };
    this.pozHistory = newPosHistory;
    return true
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.history = [];
    this.pozHistory = 0;
  }
}

const config = {
  initial: 'normal',
  states: {
    normal: {
      transitions: {
        study: 'busy',
      }
    },
    busy: {
      transitions: {
        get_tired: 'sleeping',
        get_hungry: 'hungry',
      }
    },
    hungry: {
      transitions: {
        eat: 'normal'
      },
    },
    sleeping: {
      transitions: {
        get_hungry: 'hungry',
        get_up: 'normal',
      },
    },
  }
};
let student = new FSM(config);

module.exports = FSM;
