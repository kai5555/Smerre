const tutorial = [
    {
      selector: '[data-tut="steps"]',
      content: () => (
        <p>Here you can navigate between the steps</p>
      ),
      beforeStep: (target, index) => {
        return false;
      },
      afterStep: (target, index) => {

      },
      style:{}
    },
    {
      selector: '[data-tut="picks"]',
      content: () => (
        <p>Here you can select some cards, try grabbing one</p>
      ),
      beforeStep: (target, index) => {
        return true;
      },
      afterStep: (target, index) => {

      },
      style:{}
    }
]

export default tutorial;
  
