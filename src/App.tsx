import React from "react";
import "./App.scss";
import TopBar from "./component/bar/Top";
import LeftBar from "./component/bar/Left";
import RightBar from "./component/bar/Right";
import BottomBar from "./component/bar/Bottom";
import Editor from "./component/Editor";
import Note from "./model/Note";
import Notebook from "./model/Notebook";
import Section from "./model/Section";
import Manager from "./model/Manager";
import {Action, ActionType} from "./component/shared/ContextMenu";
import {HolderItem} from "./model/Base";

let manager = new Manager();

function App() {

  const [notebooks, setNotebooks] = React.useState<Notebook[] | undefined>(manager.notebooks);
  const [activeNotebook, setActiveNotebook] = React.useState<Notebook | undefined>();
  const [activeSection, setActiveSection] = React.useState<Section | undefined>();
  const [activeNote, setActiveNote] = React.useState<Note | undefined>();

  const selectNotebook = (active: Notebook | undefined) => {
    setActiveNotebook(active);
  };

  const selectSection = (active: Section | undefined) => {
    setActiveSection(active);
  };

  const selectNote = (active: Note | undefined) => {
    setActiveNote(active);
  };

  const updateNoteContent = (content: string) => {
    if (activeNote) {
      activeNote.content = content;
    }
  };

  //TODO bubbling context all the way up here may not be necessary
  const updateContextItem = (target: HolderItem<any> | undefined, action: Action) => {
    console.log(target);
    console.log(action);

    switch (action.type) {
      case ActionType.NEW:
        if (target) {
          if (target instanceof Note) {
            //TODO insertAfter helper method?
            target.parent.addNewNote("new", target.order + 1);
          } else if (target instanceof Section) {
            target.parent.addSection("new", target.order + 1);
          } else if (target instanceof Notebook) {
            target.parent.addNotebook("new", target.order + 1);
          }
        } else {
          //TODO need to get items from originating element... possibly put onto action (also maybe the target itself)
          // this could be directly in the list, but there'll be some issues with generics
          //insert with order = list.length
        }
        break;
      case ActionType.EDIT:
        target?.rename("blob");
        break;
      case ActionType.DELETE:
        target?.parent.deleteItem(target);
        break;
      default:
    }

  };

  return (
    <div id="snovy-app">
      <TopBar/>
      <LeftBar onActiveNotebookChange={selectNotebook} notebooks={notebooks}
               onActiveSectionChange={selectSection} sections={activeNotebook?.itemsSortedByOrder}
               onActiveNoteChange={selectNote} notes={activeSection?.itemsSortedByOrder}
               contextSelection={updateContextItem}
      />
      <Editor activeNote={activeNote} onValueChange={updateNoteContent}/>
      <RightBar/>
      <BottomBar/>
    </div>
  );
}

export default App;
