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

  const onContextAction = (action: Action) => {
    console.log(action);
    if (action.target) {
      switch (action.type) {
        case ActionType.NEW:
          action.target.parent.addNewItem(action.target.order + 1);

          //this is a very hacky way of updating children, but hey, it works, sorta kinda
          if (action.target instanceof Note) {
            setActiveSection(undefined);
            setActiveSection(action.target.parent);
          } else if (action.target instanceof Section) {
            setActiveNotebook(undefined);
            setActiveNotebook(action.target.parent);
          }
          break;
        case ActionType.EDIT:
          action.target.rename("blob");
          break;
        case ActionType.DELETE:
          action.target.parent.deleteItem(action.target);
          break;
        default:
      }
    }
  };

  React.useEffect(
    () => {
      console.log(activeSection?.items);
    }, [activeSection?.items]
  );

  return (
    <div id="snovy-app">
      <TopBar/>
      <LeftBar onActiveNotebookChange={selectNotebook} notebooks={notebooks}
               onActiveSectionChange={selectSection} sections={activeNotebook?.itemsSortedByOrder}
               onActiveNoteChange={selectNote} notes={activeSection?.itemsSortedByOrder}
               contextSelection={onContextAction}
      />
      <Editor activeNote={activeNote} onValueChange={updateNoteContent}/>
      <RightBar/>
      <BottomBar/>
    </div>
  );
}

export default App;
