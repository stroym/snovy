import React from "react";
import NotebookSelector from "../selector/Notebook";
import Note from "../../model/Note";
import Section from "../../model/Section";
import Notebook from "../../model/Notebook";
import SelectorList from "../shared/SelectorList";

let n1 = new Notebook(1, "test1");
let n2 = new Notebook(2, "test2");

let s1 = new Section(1, "SECTION 1", 1);
let s11 = new Section(2, "SECTION 11", 1);
let s111 = new Section(3, "SECTION 111", 1);

let s2 = new Section(1, "SECTION 2", 2);
let s22 = new Section(2, "SECTION 22", 2);

s1.addNote(new Note(61561, "16556", 0, "bye", ""));
s2.addNote(new Note(61561, "asdsadada", 0, "hi", ""));

n1.sections.push(s1, s11, s111);
n2.sections.push(s2, s22);

let testNotebooks = [new Notebook(0, "test"), n1, n2].sort((a: Notebook, b: Notebook) => {
  return a.id - b.id;
});

export const LeftBar = () => {

  const [notebooks, setNotebooks] = React.useState<Notebook[]>(testNotebooks);
  const [activeNotebook, setActiveNotebook] = React.useState<Notebook | undefined>();
  // const [sections, setSections] = React.useState<Section[]>([]);
  const [activeSection, setActiveSection] = React.useState<Section | undefined>();
  // const [notes, setNotes] = React.useState<Note[]>([]);
  const [activeNote, setActiveNote] = React.useState<Note | undefined>();

  const selectNotebook = (active: Notebook | undefined) => {
    // console.log(active);
    setActiveNotebook(active);
    setActiveSection(undefined);
    setActiveNote(undefined);
  };

  const selectSection = (active: Section | undefined) => {
    // console.log(active);
    setActiveSection(active);
    setActiveNote(undefined);
  };

  const selectNote = (active: Note | undefined) => {
    // console.log(active);
    setActiveNote(active);
  };

  return (
    <div id="snovy-bar-left">
      <NotebookSelector notebooks={notebooks ? notebooks : []} selectActive={selectNotebook}/>
      <SelectorList<Section> id="snovy-selector-section" items={activeNotebook ? activeNotebook.sections : []}
                             selectActive={selectSection}/>
      <SelectorList<Note> id="snovy-selector-note" items={activeSection ? activeSection.notes : []}
                          selectActive={selectNote}/>
    </div>
  );

};

export default LeftBar;