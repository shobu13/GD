// @flow

//TODO: These types could be generated from GDevelop.js instead of being
//manually written here.
type EmscriptenObject = Object & {
    ptr: Number
};

declare type gdProject = EmscriptenObject;
declare type gdLayout = EmscriptenObject;
declare type gdExternalLayout = EmscriptenObject;
declare type gdExternalEvents = EmscriptenObject;
declare type gdSerializerElement = EmscriptenObject;
declare type gdInitialInstance = EmscriptenObject;
declare type gdBaseEvent = EmscriptenObject;
declare type gdResource = EmscriptenObject;
declare type gdObject = EmscriptenObject;
declare type gdResourcesManager = EmscriptenObject;

declare type gdInstruction = EmscriptenObject;
declare type gdInstructionMetadata = EmscriptenObject;
declare type gdInstructionsList = EmscriptenObject;
declare type gdParameterMetadata = EmscriptenObject;

declare type gdVariable = EmscriptenObject;
declare type gdVariablesContainer = EmscriptenObject;

declare type gdVectorPolygon2d = EmscriptenObject;

declare type gdSpriteObject = EmscriptenObject;

//Represents all objects that have serializeTo and unserializeFrom methods.
declare type gdSerializable = EmscriptenObject;
