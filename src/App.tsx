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

let n1 = new Notebook(1, "test1");
let n2 = new Notebook(2, "test2");

let s1 = new Section(1, "SECTION 1", 1);
let s11 = new Section(2, "SECTION 11", 1);
let s111 = new Section(3, "SECTION 111", 1);

let s2 = new Section(1, "SECTION 2", 2);
let s22 = new Section(2, "SECTION 22", 2);

s1.addNote("16556", 0, "bye", "");
// s1.addNote("16556", 0, "bye", "");
// s11.addNote("16556", 0, "bye", "");
s11.addNote("16556", 0, "asdasdasdads", "");

// s2.addNote("asdsadada", 0, "hi", "");
s2.addNote("asdsadada", 0, "hi", "");
s22.addNote("asdsadada", 0, "hi", "");

n1.sections.push(s1, s11, s111);
n2.sections.push(s2, s22);

let testNotebooks = [n1, n2, new Notebook(0, "test")];
// .sort((a: Notebook, b: Notebook) => {
//   return a.id - b.id;
// });

function App() {

  const [notebooks, setNotebooks] = React.useState<Notebook[]>(testNotebooks);
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

  return (
    <div id="snovy-app">
      <TopBar/>
      <LeftBar onActiveNotebookChange={selectNotebook} notebooks={notebooks}
               onActiveSectionChange={selectSection} sections={activeNotebook?.sections}
               onActiveNoteChange={selectNote} notes={activeSection?.notes}
      />
      <Editor activeNote={activeNote} onValueChange={updateNoteContent}/>
      <RightBar/>
      <BottomBar/>
    </div>
  );
}

export default App;
